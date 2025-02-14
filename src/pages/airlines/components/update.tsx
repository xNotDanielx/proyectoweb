import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRequest } from "@/hooks/useApiRequest";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// 👇 Icons
import { RefreshCcwDot } from "lucide-react";
import { DataTable } from "@/components/viewTable";

const formSchema = z.object({
  nombre: z
    .string({ required_error: "Por favor ingrese un nombre" })
    .min(1, {
      message: "El nombre de la aerolinea debe tener al menos 2 caracteres.",
    })
    .max(20, {
      message: "El nombre no debe tener más de 20 caracteres",
    }),
  codigoiata: z
    .string({ required_error: "Por favor ingrese un codigo IATA" })
    .min(2, { message: "El codigo IATA debe contener unicamente 2 caracteres" })
    .max(2, { message: "El codigo IATA debe contener unicamente 2 caracteres" }),
  codigoicao: z
    .string({ required_error: "Por favor ingrese un codigo ICAO" })
    .min(3, { message: "El codigo ICAO debe contener unicamente 3 caracteres" })
    .max(3, { message: "El codigo ICAO debe contener unicamente 3 caracteres" }),
});

export const UpdateAirlines = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Aerolineas/GetAll");
  const [filter, setFilter] = useState("");
  const { toast } = useToast();
  const { apiRequest } = useRequest();

  const columnTitles = ["Id", "Nombre", "Codigo IATA", "Codigo ICAO", "Fecha registro"];
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      codigoiata: "",
      codigoicao: "",
    },
  });

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleUpdateClick = async (updatedAirline: any, airline: any) => {
    const airlineToUpdate = {
      nombre: updatedAirline.nombre,
      codigoiata: updatedAirline.codigoiata,
      codigoicao: updatedAirline.codigoicao,
    };

    const request = await apiRequest(airlineToUpdate, `/FlyEaseApi/Aerolineas/Put/${airline.idaereolinea}`, "put");

    if(!request.error) {
      toast({
        description: "Se ha actualizado la aerolinea exitosamente",
      });
    } else {
      toast({
        description: "No se ha podido actualizar la aerolinea, intenta de nuevo.",
      });
    }
    mutate();
  };

  const handleRefreshClick = (airline: any) => {
    form.setValue("nombre", airline.nombre);
    form.setValue("codigoiata", airline.codigoiata);
    form.setValue("codigoicao", airline.codigoicao);
  };

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idaerolinea: item.idaereolinea,
          nombre: item.nombre,
          codigoiata: item.codigoiata,
          codigoicao: item.codigoicao,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          sheet: (
            <Sheet>
              <SheetTrigger>
                <RefreshCcwDot className="cursor-pointer" onClick={() => handleRefreshClick(item)} />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Actualizar pais</SheetTitle>
                </SheetHeader>
                <div className="grid gap-5 py-4">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit((updatedCountry) => handleUpdateClick(updatedCountry, item))}
                    >
                      {/* 👇 Espacio para el input del nombre */}
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de la aerolinea</FormLabel>
                            <FormControl>
                              <Input placeholder="AireLatam" {...field} />
                            </FormControl>
                            <FormDescription>El nombre de la aerolinea a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input del codigo IATA  */}
                      <FormField
                        control={form.control}
                        name="codigoiata"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Codigo IATA de la aerolinea</FormLabel>
                            <FormControl>
                              <Input placeholder="AI" {...field} />
                            </FormControl>
                            <FormDescription>El codigo IATA de la aerolinea a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input del codigo ICAO  */}
                      <FormField
                        control={form.control}
                        name="codigoicao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Codigo ICAO de la aerolinea</FormLabel>
                            <FormControl>
                              <Input placeholder="AIR" {...field} />
                            </FormControl>
                            <FormDescription>El codigo ICAO de la aerolinea a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <SheetFooter>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button>Actualizar aerolinea</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Seguro que quieres actualizar la aerolinea?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ten en cuenta que se actualizará la aerolinea seleccionada!
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={form.handleSubmit((updatedCountry) => handleUpdateClick(updatedCountry, item))}>
                                Actualizar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </SheetFooter>
                    </form>
                  </Form>
                </div>
              </SheetContent>
            </Sheet>
          ),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.idaerolinea.toString().includes(filter));
  }
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
            <h1 className="text-xl font-semibold tracking-tight">Actualizar aerolineas</h1>
            <p className="text-muted-foreground">Aquí puedes actualizar las aerolineas.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input 
              placeholder="Filtrar por id..." 
              className="max-w-sm" 
              value={filter} 
              onChange={handleFilterChange} 
            />
          </div>
          <div className="rounded-md border">
            <DataTable columnTitles={columnTitles} data={filteredData} />
          </div>
        </div>
      )}
    </div>
  );
};
