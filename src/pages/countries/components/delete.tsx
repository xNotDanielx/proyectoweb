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

export const DeleteCountry = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Paises/GetAll");
  const { toast } = useToast();
  const { apiRequest } = useRequest();
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<number>();
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idpais: item.idpais,
          nombre: item.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          deleteCheckbox: (
            <Checkbox
              checked={item.idpais === selectedCountry}
              className="w-4 h-4"
              onCheckedChange={() => handleCheckboxChange(item.idpais)}
            />
          ),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.idpais.toString().includes(filter));
  }

  const columnTitles = ["Id del pais", "Nombre del pais", "Fecha de registro"];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const handleCheckboxChange = (idpais: number) => {
    setSelectedCountry(idpais);
  };

  const handleDeleteClick = async () => {
    const idregion = selectedCountry;
    const request = await apiRequest(null, `/FlyEaseApi/Paises/Delete/${idregion}`, "delete");
    if (!request.error) {
      toast({
        description: "Se ha borrado el pais exitosamente",
      });
    } else {
      toast({
        description: "No se ha podido borrar el pais, intente de nuevo.",
      });
    }
    mutate();
  };

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
            <h1 className="text-xl font-semibold tracking-tight">Eliminar pais</h1>
            <p className="text-muted-foreground">Aquí puedes eliminar paises.</p>
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
                <Button variant="destructive">Borrar pais</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿seguro que deseas Borrar este país?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                Ten en cuenta que se Borrará el país seleccionado!
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteClick}>Borrar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
};