import { ChangeEvent, useState } from "react";
import { useRequest } from "@/hooks/useApiRequest";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/viewTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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

export const DeleteFlight = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Vuelos/GetAll");
  const [filter, setFilter] = useState<string>("");
  const { toast } = useToast();
  const { apiRequest } = useRequest();
  const [selectedFlight, setSelectedFlight] = useState<number>();
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  const handleCheckboxChange = (idvuelo: number) => {
    setSelectedFlight(idvuelo);
  };

  const handleDeleteClick = async () => {
    const idvuelo = selectedFlight;
    const request = await apiRequest(null, `/FlyEaseApi/Vuelos/Delete/${idvuelo}`, "delete");
    if (!request.error) {
      toast({
        description: "Se ha borrado el vuelo exitosamente",
      });
    } else {
      toast({
        description: "No se ha podido borrar el vuelo, intente de nuevo.",
      });
    }
    mutate();
  };

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          deleteCheckbox: (
            <Checkbox
              checked={item.idvuelo === selectedFlight}
              className="w-4 h-4"
              onCheckedChange={() => handleCheckboxChange(item.idvuelo)}
            />
            // <Checkbox className="w-4 h-4" />
          ),
          idvuelo: item.idvuelo,
          precio: item.preciovuelo,
          tarifa: item.tarifatemporada,
          descuento: item.descuento,
          distanciarecorrida: `${parseFloat(item.distanciarecorrida).toFixed(2)} km`,
          fechadespegue: new Date(item.fechayhoradesalida).toLocaleDateString(),
          fechallegada: new Date(item.fechayhorallegada).toLocaleDateString(),
          despegue: item.aeropuerto_Despegue.nombre,
          destino: item.aeropuerto_Destino.nombre,
          cupo: item.cupo ? "Disponible" : "No disponible",
          estado: item.estado.nombre,
          avion: item.avion.nombre,
          fecharegistro: new Date(item.fecharegistro).toLocaleDateString(),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.idvuelo.toString().includes(filter));
  }

  const columnTitles = [
    "Id",
    "Precio",
    "Tarifa",
    "Descuento",
    "Distancia recorrida",
    "Fecha de despegue",
    "Fecha de llegada",
    "Despegue",
    "Destino",
    "Cupo",
    "Estado",
    "Avión",
    "Fecha registro",
  ];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
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
        <div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Borrar vuelos</h1>
            <p className="text-muted-foreground">Aqui puedes borrar los vuelos activos.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input placeholder="Filtrar por id..." className="max-w-sm" value={filter} onChange={handleFilterChange} />
          </div>
          <div className="rounded-md border">
            <DataTable data={filteredData} columnTitles={columnTitles} />
          </div>
          <div className="mt-5 flex w-full justify-end">
          <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="destructive">Borrar vuelo</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Seguro que quieres borrar el vuelo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Ten en cuenta que se Borrará el vuelo seleccionado!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
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
