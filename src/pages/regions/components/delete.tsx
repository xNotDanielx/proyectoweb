import { useState, ChangeEvent } from "react";
import { useRequest } from "@/hooks/useApiRequest";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/viewTable";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const DeleteRegion = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Regiones/GetAll");
  const { toast } = useToast();
  const { apiRequest } = useRequest();
  const [filter, setFilter] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number>();
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idregion: item.idregion,
          nombre: item.nombre,
          nombrePais: item.pais.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          deleteCheckbox: (
            <Checkbox
              checked={item.idregion === selectedRegion}
              className="w-4 h-4"
              onCheckedChange={() => handleCheckboxChange(item.idregion)}
            />
            // <Checkbox className="w-4 h-4" />
          ),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.idregion.toString().includes(filter));
  }

  const columnTitles = ["Id de la region", "Nombre de la region", "Nombre del pais", "Fecha de registro"];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const handleCheckboxChange = (idregion: number) => {
    setSelectedRegion(idregion);
  };

  const handleDeleteClick = async () => {
    const idregion = selectedRegion;
    const request = await apiRequest(null, `/FlyEaseApi/Regiones/Delete/${idregion}`, "delete");

    if (!request.error) {
      toast({
        description: "Se ha eliminado la region exitosamente",
      });
    } else {
      toast({
        description: "No se ha podido eliminar la region, intente de nuevo.",
      });
    }

    mutate();
  };

//TODO: implementar un toaster (se encuentra en shadcn-ui) para mostrar un mensaje de exito o error al eliminar una region, y actualizar la tabla de regiones despues de eliminar una region

  return (
    <div>
      {loading ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Eliminar regiones</h1>
            <p className="text-muted-foreground">Aquí puedes eliminar las regiones.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtrar por numero de identificacion..."
              className="max-w-sm"
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="rounded-md border">
            <DataTable columnTitles={columnTitles} data={filteredData} />
          </div>
          <div className="flex w-full justify-end">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive">Borrar región</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿seguro que quieres Borrar esta región?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  Ten en cuenta que se Borrará la región seleccionada!
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={handleDeleteClick}>Borrar</AlertDialogAction>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
};