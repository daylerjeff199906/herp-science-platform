"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Trash2, GripVertical, FileAudio, FileImage, FileVideo, Loader2, Link, FolderOpen } from "lucide-react";
import { createFonotecaClient } from "@/utils/supabase/fonoteca/client";
import { bulkUpdateMultimediaIndexes, createMultimedia, deleteMultimedia, getMultimediaList } from "@/actions/multimedia";
import { Multimedia } from "@/types/fonoteca";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

export function MultimediaSection({ occurrenceId }: { occurrenceId: string }) {
  const [items, setItems] = useState<Multimedia[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<Multimedia | null>(null);

  // Modals
  const [urlSheetOpen, setUrlSheetOpen] = useState(false);
  const [libSheetOpen, setLibSheetOpen] = useState(false);
  const [activeUploadType, setActiveUploadType] = useState<"Sound" | "Still" | null>(null);

  // URL States
  const [urlInput, setUrlInput] = useState("");
  const [urlTitle, setUrlTitle] = useState("");

  // Library States
  const [libItems, setLibItems] = useState<Multimedia[]>([]);
  const [libLoading, setLibLoading] = useState(false);

  const supabase = createFonotecaClient();

  const loadMultimedia = async () => {
    const resp = await getMultimediaList({ occurrence_id: occurrenceId, limit: 100 });
    const sorted = (resp.data || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    setItems(sorted);
  };

  const loadLibrary = async () => {
    setLibLoading(true);
    const resp = await getMultimediaList({ limit: 100 });
    const filtered = (resp.data || []).filter(item => item.occurrence_id !== occurrenceId);
    setLibItems(filtered);
    setLibLoading(false);
  };

  useEffect(() => {
    loadMultimedia();
  }, [occurrenceId]);

  useEffect(() => {
    if (libSheetOpen) {
      loadLibrary();
    }
  }, [libSheetOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "Sound" | "Still") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(type);
    let successCount = 0;

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${occurrenceId}/${type.toLowerCase()}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("multimedia")
          .upload(fileName, file, { upsert: true });

        if (uploadError) {
          toast.error(`Error al subir ${file.name}: ${uploadError.message}`);
          continue;
        }

        const { data: urlData } = supabase.storage.from("multimedia").getPublicUrl(fileName);
        const publicUrl = urlData.publicUrl;

        await createMultimedia({
          occurrence_id: occurrenceId,
          identifier: publicUrl,
          type: type as any,
          format: file.type,
          title: file.name,
          creator: "Dashboard",
          order_index: items.length + successCount,
          rightsHolder: "Instituto de Investigaciones de la Amazonía Peruana (IIAP)",
          license: "http://creativecommons.org/licenses/by-nc/4.0/",
          tag: type === "Sound" ? "main_audio" : "gallery",
        });

        successCount++;
      } catch (err) {
        toast.error(`Error procesando ${file.name}`);
      }
    }

    setUploading(null);
    if (successCount > 0) {
      toast.success(`${successCount} archivos subidos correctamente`);
      loadMultimedia();
    }
  };

  const handleAddFromUrl = async () => {
    if (!urlInput || !activeUploadType) return;

    setUploading(activeUploadType);
    try {
      await createMultimedia({
        occurrence_id: occurrenceId,
        identifier: urlInput,
        type: activeUploadType as any,
        format: activeUploadType === "Sound" ? "audio/mpeg" : "image/jpeg",
        title: urlTitle || "Enlace URL",
        creator: "Dashboard",
        order_index: items.length,
        rightsHolder: "Instituto de Investigaciones de la Amazonía Peruana (IIAP)",
        license: "http://creativecommons.org/licenses/by-nc/4.0/",
        tag: activeUploadType === "Sound" ? "main_audio" : "gallery",
      });

      toast.success("Enlace agregado correctamente");
      setUrlSheetOpen(false);
      setUrlInput("");
      setUrlTitle("");
      loadMultimedia();
    } catch (err) {
      toast.error("Error agregando enlace");
    } finally {
      setUploading(null);
    }
  };

  const handleLinkFromLibrary = async (item: Multimedia) => {
    if (!activeUploadType) return;
    setUploading(activeUploadType);

    try {
      await createMultimedia({
        occurrence_id: occurrenceId,
        identifier: item.identifier,
        type: item.type,
        format: item.format,
        title: item.title,
        creator: "Dashboard",
        order_index: items.length,
        rightsHolder: item.rightsHolder,
        license: item.license,
        tag: item.tag,
      });

      toast.success("Elemento vinculado de la biblioteca");
      setLibSheetOpen(false);
      loadMultimedia();
    } catch (err) {
      toast.error("Error vinculando elemento");
    } finally {
      setUploading(null);
    }
  };

  const handleSpectrogramUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(itemId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${occurrenceId}/spectrogram-${itemId}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("multimedia")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        toast.error("Error al subir espectrograma: " + uploadError.message);
        setUploading(null);
        return;
      }

      const { data: urlData } = supabase.storage.from("multimedia").getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      // Creates a new ROW in multimedia with tag='spectrogram' and parent_multimedia_id != null
      await createMultimedia({
        occurrence_id: occurrenceId,
        identifier: publicUrl,
        type: "Still",
        format: file.type,
        title: `Espectrograma de ${items.find(i => i.id === itemId)?.title || itemId}`,
        creator: "Dashboard",
        order_index: 0,
        rightsHolder: "Instituto de Investigaciones de la Amazonía Peruana (IIAP)",
        license: "http://creativecommons.org/licenses/by-nc/4.0/",
        tag: "spectrogram",
        parent_multimedia_id: itemId,
      });

      toast.success("Espectrograma registrado correctamente");
      loadMultimedia();
    } catch (err) {
      toast.error("Error registrando espectrograma");
    } finally {
      setUploading(null);
    }
  };

  const handleDragStart = (item: Multimedia) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetItem: Multimedia) => {
    if (!draggedItem || draggedItem.id === targetItem.id) return;
    if (draggedItem.type !== targetItem.type) return;

    const filterType = draggedItem.type;
    const sameTypeItems = items.filter(it => it.type === filterType);
    
    const updated = items.map(it => {
      if (it.id === draggedItem.id) return { ...it, order_index: targetItem.order_index };
      if (it.id === targetItem.id) return { ...it, order_index: draggedItem.order_index };
      return it;
    });

    setItems([...updated].sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));

    await bulkUpdateMultimediaIndexes([
      { id: draggedItem.id, order_index: targetItem.order_index || 0 },
      { id: targetItem.id, order_index: draggedItem.order_index || 0 }
    ]);

    toast.success("Orden actualizado");
    setDraggedItem(null);
  };

  const handleDelete = async (id: string, isAudioChild = false) => {
    const resp = await deleteMultimedia(id);
    if (resp.success) {
      toast.success(isAudioChild ? "Espectrograma eliminado" : "Archivo eliminado");
      loadMultimedia();
    } else {
      toast.error("Error al eliminar");
    }
  };

  const audioItems = items.filter(it => it.type === "Sound" && it.tag !== "spectrogram");
  const imageItems = items.filter(it => it.type === "Still" && it.tag !== "spectrogram");

  const RenderGrid = ({ list, typeTitle, uploadType }: { list: Multimedia[], typeTitle: string, uploadType: "Sound" | "Still" }) => (
    <div className="space-y-3 border rounded-lg p-4 bg-background">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold text-base">{typeTitle}</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="xs" variant="outline" className="gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" /> Agregar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <label className="w-full h-full cursor-pointer flex items-center gap-2">
                <Upload className="h-3.5 w-3.5" /> Subir Archivo
                <input 
                  type="file" 
                  multiple 
                  accept={uploadType === "Sound" ? "audio/*" : "image/*"} 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, uploadType)} 
                />
              </label>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setActiveUploadType(uploadType); setUrlSheetOpen(true); }}>
              <Link className="h-3.5 w-3.5 mr-2" /> Desde URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setActiveUploadType(uploadType); setLibSheetOpen(true); }}>
              <FolderOpen className="h-3.5 w-3.5 mr-2" /> Biblioteca
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-4 text-xs text-muted-foreground">No hay archivos cargados.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {list.map((item) => {
            // Locate spectrogram child row linked to this main audio
            const spectrogram = items.find(it => (it as any).parent_multimedia_id === item.id && (it as any).tag === "spectrogram");

            return (
              <div 
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(item)}
                className="relative border rounded-lg p-3 bg-muted/20 flex flex-col items-center justify-center text-center cursor-move hover:bg-muted/50 transition-all duration-150"
              >
                <div className="absolute top-1.5 left-1.5 text-muted-foreground"><GripVertical className="h-3 w-3" /></div>
                <button className="absolute top-1.5 right-1.5 text-destructive hover:bg-red-50 p-1 rounded-md" onClick={() => handleDelete(item.id)}><Trash2 className="h-3.5 w-3.5" /></button>

                <div className="py-2">
                  {item.type === "Still" && <FileImage className="h-10 w-10 text-blue-500" />}
                  {item.type === "Sound" && <FileAudio className="h-10 w-10 text-green-500" />}
                </div>

                <span className="text-xs font-medium truncate w-full" title={item.title || "Archivo"}>{item.title || "Archivo"}</span>

                {item.type === "Sound" && (
                  <div className="mt-2 w-full border-t pt-2 space-y-1">
                    {spectrogram ? (
                      <div className="relative group">
                        <img src={spectrogram.identifier} alt="Spectrogram" className="h-10 w-full object-cover rounded border" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button className="text-[10px] text-white underline cursor-pointer hover:text-red-300" onClick={() => handleDelete(spectrogram.id, true)}>
                              Eliminar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center text-[10px] gap-1 text-blue-600 hover:underline cursor-pointer">
                        {uploading === item.id ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Plus className="h-2.5 w-2.5" />}
                        Espectrograma
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSpectrogramUpload(e, item.id)} />
                      </label>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 border rounded-lg p-5 bg-card mt-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Carga Multimedia de Especie</h2>
        <p className="text-sm text-muted-foreground">Sube audios e imágenes por secciones y arrastra para cambiar el orden.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RenderGrid list={audioItems} typeTitle="Multimedia - Audios & Espectrogramas" uploadType="Sound" />
        <RenderGrid list={imageItems} typeTitle="Imágenes de la Especie" uploadType="Still" />
      </div>

      {/* --- Dialog: URL --- */}
      <Sheet open={urlSheetOpen} onOpenChange={setUrlSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Agregar desde URL</SheetTitle>
            <SheetDescription>Inserta un enlace externo del audio o imagen.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4 border-t mt-4">
            <div>
              <label className="text-sm font-medium">Título del Archivo</label>
              <Input placeholder="Ej: Canto de ave en MP3" value={urlTitle} onChange={(e) => setUrlTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">URL (.mp3, .jpg, etc.)</label>
              <Input placeholder="https://mi-servidor.com/audio.mp3" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setUrlSheetOpen(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleAddFromUrl} disabled={!urlInput || uploading !== null}>
                {uploading ? "Agregando..." : "Agregar"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* --- Dialog: Library --- */}
      <Sheet open={libSheetOpen} onOpenChange={setLibSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Biblioteca de Archivos</SheetTitle>
            <SheetDescription>Selecciona un archivo existente en el sistema para vincularlo a esta ocurrencia.</SheetDescription>
          </SheetHeader>
          <div className="py-4 border-t mt-4">
            {libLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : libItems.filter(i => i.type === activeUploadType).length === 0 ? (
              <div className="text-center text-xs text-muted-foreground p-4">No hay archivos de este tipo en la biblioteca.</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {libItems.filter(i => i.type === activeUploadType).map((item) => (
                  <div 
                    key={item.id} 
                    className="border rounded-lg p-3 hover:bg-muted/30 cursor-pointer flex flex-col items-center justify-center text-center"
                    onClick={() => handleLinkFromLibrary(item)}
                  >
                    {item.type === "Still" && <FileImage className="h-10 w-10 text-blue-500 mb-1" />}
                    {item.type === "Sound" && <FileAudio className="h-10 w-10 text-green-500 mb-1" />}
                    <span className="text-xs font-medium line-clamp-2 w-full">{item.title || "Archivo"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
