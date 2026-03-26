"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { bulkUpsert } from "@/actions/bulk";
import { toast } from "react-toastify";
import { PageHeader } from "@/components/panel-admin/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const TABLES = [
  { 
    id: "taxa", 
    label: "Taxonomía (Taxones)", 
    headers: ["id", "taxonID", "scientificName", "acceptedNameUsage", "specificEpithet", "infraspecificEpithet", "taxonRank", "scientificNameAuthorship", "vernacularName", "nomenclaturalCode", "genus_id"] 
  },
  { 
    id: "occurrences", 
    label: "Monitoreo (Ocurrencias)", 
    headers: ["id", "occurrenceID", "taxon_id", "location_id", "basisOfRecord", "recordedBy", "identifiedBy", "eventDate", "eventTime", "institutionCode", "collectionCode", "catalogNumber", "samplingProtocol", "lifeStage", "sex", "reproductiveCondition", "occurrenceRemarks"] 
  },
  { 
    id: "locations", 
    label: "Geografía (Ubicaciones)", 
    headers: ["id", "locationID", "continent", "country", "countryCode", "stateProvince", "county", "locality", "decimalLatitude", "decimalLongitude", "coordinateUncertaintyInMeters", "elevation", "elevationAccuracy", "habitat"] 
  },
  { 
    id: "multimedia", 
    label: "Mediateca (Multimedia)", 
    headers: ["id", "occurrence_id", "identifier", "type", "format", "order_index", "title", "description", "creator", "rightsHolder", "license", "tag", "parent_multimedia_id"] 
  },
];

export function BulkClient() {
  const [selectedTable, setSelectedTable] = useState(TABLES[0].id);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [results, setResults] = useState<{ successCount: number; errorCount: number; errors: string[] } | null>(null);

  const currentTable = TABLES.find(t => t.id === selectedTable) || TABLES[0];

  const downloadTemplate = () => {
    if (!currentTable) return;
    const csvContent = currentTable.headers.join(",") + "\n" +
      currentTable.headers.map(h => "VALOR").join(","); // Example data
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `plantilla_${selectedTable}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileParse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        if (file.type === "application/json" || file.name.endsWith(".json")) {
           setPreviewData(JSON.parse(text));
        } else {
          // Robust CSV parsing to handle quoted values and commas
          const lines = text.split("\n").filter(l => l.trim() !== "");
          if (lines.length === 0) {
            setPreviewData([]);
            return;
          }

          const splitCSVLine = (line: string) => {
            const result = [];
            let start = 0;
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
              if (line[i] === '"') inQuotes = !inQuotes;
              if (line[i] === ',' && !inQuotes) {
                let cell = line.substring(start, i).trim();
                // Strip surrounding quotes
                if (cell.startsWith('"') && cell.endsWith('"')) {
                  cell = cell.substring(1, cell.length - 1);
                }
                result.push(cell.replace(/""/g, '"')); // Handle escaped quotes
                start = i + 1;
              }
            }
            let lastCell = line.substring(start).trim();
            if (lastCell.startsWith('"') && lastCell.endsWith('"')) {
              lastCell = lastCell.substring(1, lastCell.length - 1);
            }
            result.push(lastCell.replace(/""/g, '"'));
            return result;
          };

          const header = splitCSVLine(lines[0]);
          const items = lines.slice(1).map(line => {
            const values = splitCSVLine(line);
            const obj: any = {};
            header.forEach((key, index) => {
              const val = values[index];
              // Convert empty strings or "null" string to actual null
              obj[key] = (val === "" || val === "null" || val === undefined) ? null : val;
            });
            return obj;
          });
          setPreviewData(items);
        }
        setResults(null);
      } catch (err) {
        toast.error("Error procesando el archivo");
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (previewData.length === 0) return;
    
    setLoading(true);
    try {
      const resp = await bulkUpsert(selectedTable, previewData);
      setResults({
        successCount: resp.successCount || 0,
        errorCount: resp.errorCount || 0,
        errors: resp.errors || []
      });
      
      if (resp.success) {
        toast.success("Operación completada");
      } else {
        toast.error("Hubo errores en el proceso");
      }
    } catch (err) {
      toast.error("Error de comunicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operaciones Masivas"
        description="Agrega o actualiza información en lote mediante archivos CSV o JSON."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Configuración</CardTitle>
            <CardDescription>Selecciona la tabla y descarga la plantilla.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Tabla de Destino</label>
              <Select value={selectedTable} onValueChange={(val) => { setSelectedTable(val); setPreviewData([]); setResults(null); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tabla" />
                </SelectTrigger>
                <SelectContent>
                  {TABLES.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full gap-2" onClick={downloadTemplate}>
              <Download className="h-4 w-4" /> Bajar Plantilla (.csv)
            </Button>

            <div className="pt-4 border-t">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Subir Archivo</label>
                <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50">
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium">Click para cargar</span>
                  <input type="file" onChange={handleFileParse} className="hidden" accept=".csv,.json" />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Previsualización y Envío</CardTitle>
            <CardDescription>{previewData.length} registros cargados.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-auto">
            {previewData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {previewData.length > 0 && Object.keys(previewData[0]).map(k => (
                      <TableHead key={k} className="text-[10px] uppercase font-bold">{k}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 10).map((row, idx) => (
                    <TableRow key={idx}>
                      {Object.values(row).map((v: any, i) => (
                        <TableCell key={i} className="text-[10px] truncate max-w-[150px]">{v !== null ? String(v) : "-"}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground text-sm italic">
                Carga un archivo para ver la previsualización
              </div>
            )}
            {previewData.length > 10 && (
                <p className="mt-2 text-[10px] text-muted-foreground italic">+ Mostrando solo los primeros 10 registros</p>
            )}
          </CardContent>
          <CardFooter className="justify-end gap-2 border-t pt-4">
             <Button variant="ghost" onClick={() => setPreviewData([])} disabled={loading}>Limpiar</Button>
             <Button onClick={handleSubmit} disabled={loading || previewData.length === 0} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Confirmar y Procesar Carga
             </Button>
          </CardFooter>
        </Card>
      </div>

      {results && (
        <Alert variant={results.errorCount > 0 ? "destructive" : "default"} className={results.errorCount === 0 ? "border-green-500 bg-green-50" : ""}>
          <div className="flex gap-3">
             {results.errorCount === 0 ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5" />}
             <div className="flex-1">
                <AlertTitle>Resultados del Proceso</AlertTitle>
                <AlertDescription>
                  <div className="flex gap-4 mt-2 mb-2 font-medium">
                    <span className="text-green-600">✓ Éxitos: {results.successCount}</span>
                    <span className="text-red-500">✕ Errores: {results.errorCount}</span>
                  </div>
                  {results.errors.length > 0 && (
                    <div className="mt-2 border-t pt-2 max-h-40 overflow-auto">
                       <ul className="list-disc pl-4 text-xs space-y-1">
                         {results.errors.map((e, idx) => <li key={idx}>{e}</li>)}
                       </ul>
                    </div>
                  )}
                </AlertDescription>
             </div>
          </div>
        </Alert>
      )}
    </div>
  );
}
