"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Trash2, GripVertical, FileAudio, FileImage, FileVideo, Loader2 } from "lucide-react";
import { createFonotecaClient } from "@/utils/supabase/fonoteca/client";
import { bulkUpdateMultimediaIndexes, createMultimedia, deleteMultimedia, getMultimediaList, updateMultimediaSpectrogram } from "@/actions/multimedia";
import { Multimedia } from "@/types/fonoteca";
import { toast } from "sonner";

export function MultimediaSection({ occurrenceId }: { occurrenceId: string }) {
  const [items, setItems] = useState<Multimedia[]>([]);
  const [uploading, setUploading] = useState<string | null>(null); // 'Sound' | 'Still' | id of item
  const [draggedItem, setDraggedItem] = useState<Multimedia | null>(null);

  const supabase = createFonotecaClient();

  const loadMultimedia = async () => {
    const resp = await getMultimediaList({ occurrence_id: occurrenceId, limit: 100 });
    const sorted = (resp.data || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    setItems(sorted);
  };

  useEffect(() => {
    loadMultimedia();
  }, [occurrenceId]);

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

      await updateMultimediaSpectrogram(itemId, publicUrl);
      toast.success("Espectrograma vinculado correctamente");
      loadMultimedia();
    } catch (err) {
      toast.error("Error vinculando espectrograma");
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
    if (draggedItem.type !== targetItem.type) return; // Only swap same types

    const filterType = draggedItem.type;
    const sameTypeItems = items.filter(it => it.type === filterType);
    
    // Swap indexes
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

  const handleDelete = async (id: string) => {
    const resp = await deleteMultimedia(id);
    if (resp.success) {
      toast.success("Archivo eliminado");
      loadMultimedia();
    } else {
      toast.error("Error al eliminar");
    }
  };

  const audioItems = items.filter(it => it.type === "Sound");
  const imageItems = items.filter(it => it.type === "Still");

  const RenderGrid = ({ list, typeTitle, uploadType }: { list: Multimedia[], typeTitle: string, uploadType: "Sound" | "Still" }) => (
    <div className="space-y-3 border rounded-lg p-4 bg-background">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold text-base">{typeTitle}</h3>
        <label className="flex items-center gap-2 border px-3 py-1.5 rounded-md hover:bg-muted font-medium text-xs cursor-pointer shadow-sm">
          <Upload className="h-3.5 w-3.5" /> 
          {uploading === uploadType ? "Subiendo..." : "Subir"}
          <input 
            type="file" 
            multiple 
            accept={uploadType === "Sound" ? "audio/*" : "image/*"} 
            className="hidden" 
            onChange={(e) => handleFileUpload(e, uploadType)} 
            disabled={uploading !== null} 
          />
        </label>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-4 text-xs text-muted-foreground">No hay archivos cargados.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {list.map((item) => (
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

              {/* Extras for Audio: Spectrogram Upload */}
              {item.type === "Sound" && (
                <div className="mt-2 w-full border-t pt-2 space-y-1">
                  {(item as any).spectrogram_url ? (
                    <div className="relative group">
                      <img src={(item as any).spectrogram_url} alt="Spectrogram" className="h-10 w-full object-cover rounded border" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <label className="text-[10px] text-white underline cursor-pointer">
                            Reemplazar
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSpectrogramUpload(e, item.id)} />
                         </label>
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
          ))}
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
    </div>
  );
}
