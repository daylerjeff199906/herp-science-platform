"use client"

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Plus, Upload, Trash2, GripVertical, FileAudio, FileImage, Loader2, Link, FolderOpen, Pencil } from "lucide-react";
import { createFonotecaClient } from "@/utils/supabase/fonoteca/client";
import { bulkUpdateMultimediaIndexes, createMultimedia, deleteMultimedia, getMultimediaList, updateMultimedia, uploadToR2 } from "@/actions/multimedia";
import { Multimedia, MEDIA_TYPE, MEDIA_TAG, MediaType, MediaTag } from "@/types/fonoteca";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@repo/ui/components/ui/sheet";
import { Input } from "@repo/ui/components/ui/input";

const getDriveEmbedUrl = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|open\?id%3D)|docs\.google\.com\/.*?srcid=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return null;
};

const getDriveThumbnailUrl = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|open\?id%3D)|docs\.google\.com\/.*?srcid=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
  }
  return null;
};

export function MultimediaSection({ occurrenceId }: { occurrenceId: string }) {
  const [items, setItems] = useState<Multimedia[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<Multimedia | null>(null);

  // Modals
  const [urlSheetOpen, setUrlSheetOpen] = useState(false);
  const [libSheetOpen, setLibSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingItem, setEditingItem] = useState<Multimedia | null>(null);
  const [activeUploadType, setActiveUploadType] = useState<MediaType | null>(null);
  const [activeParentItemId, setActiveParentItemId] = useState<string | null>(null);

  // URL States
  const [urlInput, setUrlInput] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlCreator, setUrlCreator] = useState("Dashboard");
  const [urlRightsHolder, setUrlRightsHolder] = useState("Instituto de Investigaciones de la Amazonía Peruana (IIAP)");
  const [urlLicense, setUrlLicense] = useState("http://creativecommons.org/licenses/by-nc/4.0/");

  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCreator, setEditCreator] = useState("");
  const [editRightsHolder, setEditRightsHolder] = useState("");
  const [editLicense, setEditLicense] = useState("");
  const [editTag, setEditTag] = useState("");

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

  const handleFileUpload = async (files: File[], type: MediaType) => {
    if (!files || files.length === 0) return;

    setUploading(type);
    let successCount = 0;

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${type.toLowerCase()}-${occurrenceId}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

        const sizeLimit = type === MEDIA_TYPE.SOUND ? 50 * 1024 * 1024 : 4 * 1024 * 1024;
        if (file.size > sizeLimit) {
          toast.error(`El archivo ${file.name} supera el límite de ${type === MEDIA_TYPE.SOUND ? '50MB' : '4MB'}`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", fileName);

        const uploadResp = await uploadToR2(formData);

        if (uploadResp.error || !uploadResp.url) {
          toast.error(`Error al subir ${file.name}: ${uploadResp.error}`);
          continue;
        }

        const publicUrl = uploadResp.url;

        const createResp = await createMultimedia({
          occurrence_id: occurrenceId,
          identifier: publicUrl,
          type: type as any,
          format: file.type,
          title: file.name,
          creator: "Dashboard",
          order_index: items.length + successCount,
          rightsHolder: "Instituto de Investigaciones de la Amazonía Peruana (IIAP)",
          license: "http://creativecommons.org/licenses/by-nc/4.0/",
          tag: type === MEDIA_TYPE.SOUND ? MEDIA_TAG.MAIN_AUDIO : MEDIA_TAG.GALLERY,
        });

        if (createResp.error) {
          toast.error(`Error al registrar ${file.name} en BD: ` + JSON.stringify(createResp.error));
          continue;
        }

        successCount++;
      } catch (err) {
        console.error(`File processing error for ${file.name}:`, err);
        toast.error(`Error procesando ${file.name}: ` + (err instanceof Error ? err.message : String(err)));
      }
    }

    setUploading(null);
    if (successCount > 0) {
      toast.success(`${successCount} archivos subidos correctamente`);
      loadMultimedia();
    }
  };

  const handleAddFromUrl = async () => {
    if (!urlInput || (!activeUploadType && !activeParentItemId)) return;

    setUploading(activeParentItemId ? MEDIA_TAG.SPECTROGRAM : activeUploadType);
    try {
      const isSpectro = !!activeParentItemId;
      await createMultimedia({
        occurrence_id: occurrenceId,
        identifier: urlInput,
        type: isSpectro ? MEDIA_TYPE.STILL : (activeUploadType as any),
        format: isSpectro ? "image/jpeg" : (activeUploadType === MEDIA_TYPE.SOUND ? "audio/mpeg" : "image/jpeg"),
        title: urlTitle || (isSpectro ? `Histograma de ${items.find(i => i.id === activeParentItemId)?.title || "Audio"}` : "Enlace URL"),
        creator: urlCreator || "Dashboard",
        order_index: isSpectro ? items.filter(it => it.parent_multimedia_id === activeParentItemId).length : items.length,
        rightsHolder: urlRightsHolder || "Instituto de Investigaciones de la Amazonía Peruana (IIAP)",
        license: urlLicense || "http://creativecommons.org/licenses/by-nc/4.0/",
        tag: isSpectro ? MEDIA_TAG.SPECTROGRAM : (activeUploadType === MEDIA_TYPE.SOUND ? MEDIA_TAG.MAIN_AUDIO : MEDIA_TAG.GALLERY),
        parent_multimedia_id: activeParentItemId || undefined,
      });

      toast.success(isSpectro ? "Histograma agregado" : "Enlace agregado correctamente");
      setUrlSheetOpen(false);
      setUrlInput("");
      setUrlTitle("");
      setActiveParentItemId(null);
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
        creator: item.creator || "Dashboard",
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

  const handleEditClick = (item: Multimedia) => {
    setEditingItem(item);
    setEditTitle(item.title || "");
    setEditUrl(item.identifier);
    setEditCreator(item.creator || "Dashboard");
    setEditRightsHolder(item.rightsHolder || "Instituto de Investigaciones de la Amazonía Peruana (IIAP)");
    setEditLicense(item.license || "http://creativecommons.org/licenses/by-nc/4.0/");
    setEditTag(item.tag || "");
    setEditSheetOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setUploading("editing");

    try {
      const resp = await updateMultimedia(editingItem.id, {
        occurrence_id: editingItem.occurrence_id,
        identifier: editUrl,
        type: editingItem.type,
        format: editingItem.format,
        title: editTitle,
        creator: editCreator,
        order_index: editingItem.order_index,
        rightsHolder: editRightsHolder,
        license: editLicense,
        tag: editTag,
        parent_multimedia_id: editingItem.parent_multimedia_id
      });

      if (resp.error) {
        toast.error("Error al actualizar");
      } else {
        toast.success("Elemento actualizado correctamente");
        setEditSheetOpen(false);
        setEditingItem(null);
        loadMultimedia();
      }
    } catch (err) {
      toast.error("Error actualizando elemento");
    } finally {
      setUploading(null);
    }
  };

  const uploadSpectrogramFile = async (file: File, itemId: string) => {
    setUploading(itemId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `spectrogram-${occurrenceId}-${itemId}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      if (file.size > 2 * 1024 * 1024) {
        toast.error("El espectrograma supera el límite de 2MB");
        return false;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", fileName);

      const uploadResp = await uploadToR2(formData);

      if (uploadResp.error || !uploadResp.url) {
        toast.error("Error al subir imagen: " + uploadResp.error);
        return false;
      }

      const publicUrl = uploadResp.url;

      const createResp = await createMultimedia({
        occurrence_id: occurrenceId,
        identifier: publicUrl,
        type: MEDIA_TYPE.STILL,
        format: file.type,
        title: `Histograma de ${items.find(i => i.id === itemId)?.title || itemId}`,
        creator: "Dashboard",
        order_index: items.filter(it => it.parent_multimedia_id === itemId).length,
        rightsHolder: "Instituto de Investigaciones de la Amazonía Peruana (IIAP)",
        license: "http://creativecommons.org/licenses/by-nc/4.0/",
        tag: MEDIA_TAG.SPECTROGRAM,
        parent_multimedia_id: itemId,
      });

      if (createResp.error) {
        toast.error("Error al registrar espectrograma en BD: " + JSON.stringify(createResp.error));
        return false;
      }

      return true;
    } catch (err) {
      console.error("Spectrogram upload error:", err);
      toast.error("Error registrando imagen: " + (err instanceof Error ? err.message : String(err)));
      return false;
    } finally {
      setUploading(null);
    }
  };

  const handleSpectrogramUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (await uploadSpectrogramFile(file, itemId)) {
      toast.success("Histograma registrado correctamente");
      loadMultimedia();
    }
  };

  const handleDragStart = (item: Multimedia) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetItem: Multimedia) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (targetItem.type === MEDIA_TYPE.SOUND) {
        const imageFiles = files.filter(f => f.type.startsWith("image/"));
        if (imageFiles.length > 0) {
          let count = 0;
          for (const file of imageFiles) {
            if (await uploadSpectrogramFile(file, targetItem.id)) count++;
          }
          if (count > 0) {
            toast.success(`${count} histograma(s) subido(s)`);
            loadMultimedia();
          }
          return;
        }
      }
      return;
    }

    if (!draggedItem || draggedItem.id === targetItem.id) return;
    if (draggedItem.type !== targetItem.type) return;

    const filterType = draggedItem.type;
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

  const audioItems = items.filter(it => it.type === MEDIA_TYPE.SOUND && it.tag !== MEDIA_TAG.SPECTROGRAM);
  const imageItems = items.filter(it => it.type === MEDIA_TYPE.STILL && it.tag !== MEDIA_TAG.SPECTROGRAM);

  const RenderGrid = ({ list, typeTitle, uploadType }: { list: Multimedia[], typeTitle: string, uploadType: MediaType }) => (
    <div className="space-y-3 mt-2">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-sm font-semibold text-foreground/85">{typeTitle}</h3>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" /> Agregar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setActiveUploadType(uploadType); setSelectedFiles([]); setUploadSheetOpen(true); }}>
              <Upload className="h-3.5 w-3.5 mr-2" /> Subir Archivo
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
            // spectrograms rendered dynamically inside card

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item)}
                className="relative border rounded-lg p-3 bg-muted/20 flex flex-col items-center justify-center text-center cursor-move hover:bg-muted/50 transition-all duration-150"
              >
                <div className="absolute top-1.5 left-1.5 text-muted-foreground"><GripVertical className="h-3 w-3" /></div>
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10">
                  <button className="text-blue-500 hover:bg-blue-50 p-1 rounded-md" onClick={(e) => { e.stopPropagation(); handleEditClick(item); }} title="Editar">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="text-destructive hover:bg-red-50 p-1 rounded-md" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} title="Eliminar">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="py-2 w-full flex items-center justify-center">
                  {item.type === MEDIA_TYPE.STILL ? (
                    <div className="aspect-video w-full max-h-24 rounded border overflow-hidden bg-muted/20">
                      <img
                        src={getDriveThumbnailUrl(item.identifier) || item.identifier}
                        className="h-full w-full object-cover"
                        alt={item.title || "Imagen"}
                        onError={(e) => {
                          const parent = (e.target as any).parentNode;
                          if (parent) {
                            parent.innerHTML = '<div class="flex items-center justify-center h-full"><svg class="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <FileAudio className="h-10 w-10 text-green-500" />
                  )}
                </div>

                <span className="text-xs font-medium truncate w-full" title={item.title || "Archivo"}>{item.title || "Archivo"}</span>

                {item.type === MEDIA_TYPE.SOUND && (
                  <div className="mt-2 w-full border-t pt-2 space-y-2">
                    {items.filter(it => it.parent_multimedia_id === item.id && it.tag === MEDIA_TAG.SPECTROGRAM).length > 0 && (
                      <div className="grid grid-cols-2 gap-1 w-full">
                        {items
                          .filter(it => it.parent_multimedia_id === item.id && it.tag === "spectrogram")
                          .map((sp) => {
                            const spImg = getDriveThumbnailUrl(sp.identifier) || sp.identifier;
                            return (
                              <div key={sp.id} className="relative group rounded border overflow-hidden aspect-video bg-muted/20">
                                <img src={spImg} className="h-full w-full object-cover" alt="Histograma" />
                                <button
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-destructive/80 text-white p-1 rounded-sm hover:bg-destructive transition-opacity"
                                  onClick={(e) => { e.stopPropagation(); handleDelete(sp.id, true); }}
                                  title="Eliminar Histograma"
                                >
                                  <Trash2 className="h-2.5 w-2.5" />
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <button className="flex items-center justify-center w-full text-[10px] gap-1 text-blue-600 hover:underline cursor-pointer border border-dashed rounded py-1 bg-blue-50/10" onClick={e => e.stopPropagation()}>
                          {uploading === item.id ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Plus className="h-2.5 w-2.5" />}
                          Agregar Histograma
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem className="text-xs" onClick={() => { setActiveParentItemId(item.id); setActiveUploadType(MEDIA_TYPE.STILL); setSelectedFiles([]); setUploadSheetOpen(true); }}>
                          <Upload className="h-3 w-3 mr-1" /> Subir Imagen
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs" onClick={() => { setActiveParentItemId(item.id); setActiveUploadType(MEDIA_TYPE.STILL); setUrlSheetOpen(true); }}>
                          <Link className="h-3 w-3 mr-1" /> Desde URL
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
    <div className="space-y-6 mt-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Carga Multimedia de Especie</h3>
        </div>
        <p className="text-xs text-muted-foreground">Sube audios e imágenes por secciones y arrastra para cambiar el orden.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RenderGrid list={audioItems} typeTitle="Audios & Espectrogramas" uploadType={MEDIA_TYPE.SOUND} />
        <div className="border-t border-muted/50 my-2" />
        <RenderGrid list={imageItems} typeTitle="Imágenes de la Especie" uploadType={MEDIA_TYPE.STILL} />
      </div>

      {/* --- Dialog: URL --- */}
      <Sheet open={urlSheetOpen} onOpenChange={(open) => { setUrlSheetOpen(open); if (!open) setActiveParentItemId(null); }}>
        <SheetContent className="sm:max-w-xl pb-0">
          <SheetHeader>
            <SheetTitle>Agregar desde URL</SheetTitle>
            <SheetDescription>Inserta un enlace externo del audio o imagen.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 border-t mt-4 p-2 md:p-4 flex-1 overflow-y-auto max-h-[80vh]">

            {/* Visualizer */}
            {urlInput && (
              <div className="aspect-video relative rounded-lg border bg-muted flex flex-col items-center justify-center overflow-hidden mb-4 shadow-sm">
                {getDriveEmbedUrl(urlInput) ? (
                  <iframe src={getDriveEmbedUrl(urlInput)!} className="absolute inset-0 w-full h-full" frameBorder="0" allowFullScreen />
                ) : activeUploadType === MEDIA_TYPE.STILL ? (
                  <img src={urlInput} className="object-cover h-full w-full" alt="Preview Image" onError={(e) => { (e.target as any).src = "https://placehold.co/600x400?text=Error+Loading+Image" }} />
                ) : (
                  <audio src={urlInput} controls className="w-[90%] mt-auto mb-4" />
                )}
              </div>
            )}

            <div className="rounded-md border bg-card">
              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase cursor-pointer">Título *</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="p. ej. Canto de ave en MP3" value={urlTitle} onChange={(e) => setUrlTitle(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">URL *</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="https://mi-servidor.com/audio.mp3" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Creador</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="p. ej. Investigador" value={urlCreator} onChange={(e) => setUrlCreator(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Derechos</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="Institución" value={urlRightsHolder} onChange={(e) => setUrlRightsHolder(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Licencia</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="http://..." value={urlLicense} onChange={(e) => setUrlLicense(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setUrlSheetOpen(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleAddFromUrl} disabled={!urlInput || uploading !== null}>
                {uploading ? "Agregando..." : "Agregar Desde URL"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* --- Dialog: Library --- */}
      <Sheet open={libSheetOpen} onOpenChange={setLibSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="">
            <SheetTitle>Biblioteca de Archivos</SheetTitle>
            <SheetDescription>Selecciona un archivo existente en el sistema para vincularlo a esta ocurrencia.</SheetDescription>
          </SheetHeader>
          <div className="py-4 border-t mt-4">
            {libLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : libItems.filter(i => i.type === activeUploadType).length === 0 ? (
              <div className="text-center text-xs text-muted-foreground p-4">No hay archivos de este tipo en la biblioteca.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {libItems.filter(i => i.type === activeUploadType).map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-3 hover:bg-muted/30 cursor-pointer flex flex-col items-center justify-center text-center transition-all bg-muted/10 hover:shadow-sm"
                    onClick={() => handleLinkFromLibrary(item)}
                  >
                    {item.type === MEDIA_TYPE.STILL && <FileImage className="h-10 w-10 text-blue-500 mb-1" />}
                    {item.type === MEDIA_TYPE.SOUND && <FileAudio className="h-10 w-10 text-green-500 mb-1" />}
                    <span className="text-xs font-semibold line-clamp-2 w-full text-foreground/80">{item.title || "Archivo"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* --- Dialog: Edit --- */}
      <Sheet open={editSheetOpen} onOpenChange={(open) => { setEditSheetOpen(open); if (!open) setEditingItem(null); }}>
        <SheetContent className="sm:max-w-xl p-2 md:p-4">
          <SheetHeader>
            <SheetTitle>Editar Elemento</SheetTitle>
            <SheetDescription>Modifica el título o el enlace de la multimedia.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4 border-t mt-4 flex-1 overflow-y-auto max-h-[80vh]">

            {/* Visualizer */}
            {editUrl && (
              <div className="aspect-video relative rounded-lg border bg-muted flex flex-col items-center justify-center overflow-hidden mb-4 shadow-sm">
                {getDriveEmbedUrl(editUrl) ? (
                  <iframe src={getDriveEmbedUrl(editUrl)!} className="absolute inset-0 w-full h-full" frameBorder="0" allowFullScreen />
                ) : editingItem?.type === MEDIA_TYPE.STILL ? (
                  <img src={editUrl} className="object-cover h-full w-full" alt="Preview Image" onError={(e) => { (e.target as any).src = "https://placehold.co/600x400?text=Error+Loading+Image" }} />
                ) : (
                  <audio src={editUrl} controls className="w-[90%] mt-auto mb-4" />
                )}
              </div>
            )}

            <div className="rounded-md border bg-card">
              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase cursor-pointer">Título *</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="p. ej. Canto de ave" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">URL *</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="https://..." value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Creador</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="p. ej. Investigador" value={editCreator} onChange={(e) => setEditCreator(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Derechos</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="Institución" value={editRightsHolder} onChange={(e) => setEditRightsHolder(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Licencia</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="http://..." value={editLicense} onChange={(e) => setEditLicense(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 border-b border-muted/50 last:border-0">
                <div className="w-1/3 flex items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Etiqueta</label>
                </div>
                <div className="w-2/3">
                  <Input placeholder="p. ej. main_audio" value={editTag} onChange={(e) => setEditTag(e.target.value)} className="font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-8 px-2" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { setEditSheetOpen(false); setEditingItem(null); }}>Cancelar</Button>
              <Button size="sm" onClick={handleSaveEdit} disabled={!editUrl || uploading !== null}>
                {uploading === "editing" ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {/* --- Dialog: Local Upload --- */}
      <Sheet open={uploadSheetOpen} onOpenChange={(open) => { setUploadSheetOpen(open); if (!open) setSelectedFiles([]); }}>
        <SheetContent className="sm:max-w-xl p-2 md:p-4 flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Subir Archivos</SheetTitle>
            <SheetDescription>Arrastra y suelta tus archivos aquí o haz clic para seleccionar.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4 border-t mt-4 flex-1 flex flex-col overflow-y-auto max-h-[80vh]">
            
            <div 
              className={`border-2 border-dashed rounded-xl p-8 flex-1 flex flex-col items-center justify-center cursor-pointer transition-all max-h-[250px] ${
                isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files) {
                  const files = Array.from(e.dataTransfer.files);
                  const validFiles = files.filter(f => 
                    activeUploadType === MEDIA_TYPE.SOUND && !activeParentItemId ? f.type.startsWith("audio/") : f.type.startsWith("image/")
                  );
                  setSelectedFiles([...selectedFiles, ...validFiles]);
                }
              }}
              onClick={() => document.getElementById("file-sheet-upload")?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Arrastra tus archivos aquí</p>
              <p className="text-xs text-muted-foreground mt-1">O haz clic para explorar</p>
              <input 
                id="file-sheet-upload" 
                type="file" 
                multiple 
                accept={activeUploadType === MEDIA_TYPE.SOUND && !activeParentItemId ? "audio/*" : "image/*"} 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);
                    setSelectedFiles([...selectedFiles, ...files]);
                  }
                }} 
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2 bg-muted/20">
                {selectedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-1.5 border-b last:border-0">
                    <span className="truncate max-w-[80%] font-medium">{f.name}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={(e) => { e.stopPropagation(); setSelectedFiles(selectedFiles.filter((_, idx) => idx !== i)) }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { setUploadSheetOpen(false); setSelectedFiles([]); setActiveParentItemId(null); }}>Cancelar</Button>
              <Button size="sm" disabled={selectedFiles.length === 0 || uploading !== null} onClick={async () => {
                if (activeParentItemId) {
                  let count = 0;
                  for (const file of selectedFiles) {
                    if (await uploadSpectrogramFile(file, activeParentItemId)) count++;
                  }
                  if (count > 0) {
                    toast.success(`${count} histogramas registrados correctamente`);
                    loadMultimedia();
                  }
                } else {
                  await handleFileUpload(selectedFiles, activeUploadType!);
                }
                setSelectedFiles([]);
                setUploadSheetOpen(false);
                setActiveParentItemId(null);
              }}>
                {uploading ? "Subiendo..." : "Iniciar Carga"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
