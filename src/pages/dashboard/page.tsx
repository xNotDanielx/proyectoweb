import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/ui/icons";
import { useGet } from "@/hooks/useGet";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';



export const DashboardPage = () => {
  const { data, loading } = useGet("/FlyEaseApi/Boletos/GetAll");
  let currentYeartotal = 0;
  let lastYearTotal = 0;
  let yearlyTotalDifferencePercentage = 0;

  
  
  const dataset = [
    {
      vuelos: 59,
      month: 'Ene',
    },
    {
      vuelos: 28,
      month: 'Feb',
    },
    {
      vuelos: 41,
      month: 'Mar',
    },
    {
      vuelos: 73,
      month: 'Abr',
    },
    {
      vuelos: 99,
      month: 'May',
    },
    {
      vuelos: 144,
      month: 'Jun',
    },
    {
      vuelos: 319,
      month: 'Jul',
    },
    {
      vuelos: 249,
      month: 'Ago',
    },
    {
      vuelos: 131,
      month: 'Sept',
    },
    {
      vuelos: 55,
      month: 'Oct',
    },
    {
      vuelos: 48,
      month: 'Nov',
    },
    {
      vuelos: 25,
      month: 'Dic',
    },
  ];
  
  const valueFormatter = (value: number | null) => `${value} vuelos`;
  
  const chartSetting = {
    series: [{ dataKey: 'vuelos', valueFormatter }],
    height: 300,
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: 'translateX(-10px)',
      },
    },
  };

  if (!loading && data) {
    const boletos = (data as any).response;
    const añoActual = new Date().getFullYear();
    const añoAnterior = añoActual - 1;

    const boletosAñoActual = boletos.filter(
      (boleto: any) => new Date(boleto.fecharegistro).getFullYear() === añoActual
    );
    const boletosAñoAnterior = boletos.filter(
      (boleto: any) => new Date(boleto.fecharegistro).getFullYear() === añoAnterior
    );

    currentYeartotal = boletosAñoActual.reduce((sum: number, boleto: any) => sum + boleto.precio, 0);
    lastYearTotal = boletosAñoAnterior.reduce((sum: number, boleto: any) => sum + boleto.precio, 0);

    yearlyTotalDifferencePercentage = ((currentYeartotal - lastYearTotal) / lastYearTotal) * 100;
  }

  return (
    <>
      <div className="hidden flex-col md:flex">
  <div className="flex-1 space-y-4 mt-10 p-8 pt-6">
    <div className="flex items-center justify-between space-y-10">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
    </div>
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="col-span-2 md:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total recaudado</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <Icons.spinner className="size-6 animate-spin" />
                  ) : (
                    `$${currentYeartotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{yearlyTotalDifferencePercentage}% que el año anterior</p>
              </CardContent>
            </Card>
          </div>                    
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="col-span-2 md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className='text-center'>Destinos populares</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: 3, label: 'Barranquilla' },
                        { id: 1, value: 5, label: 'Bogota' },
                        { id: 2, value: 2, label: 'Medellin' },
                        { id: 3, value: 4, label: 'cali' },
                        { id: 4, value: 1, label: 'cartagena' },
                        { id: 6, value: 10, label: 'valledupar' },
                      ],
                    },
                  ]}
                  width={400}
                  height={200}
                />
                </div>                
              </CardContent>
            </Card>
          </div>
          <div>
          <Card className="h-full">
              <CardHeader>
                <CardTitle className='text-center'>Vuelos vs Meses</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
              <BarChart
        dataset={dataset}
        xAxis={[
          { scaleType: 'band', dataKey: 'month' },
        ]}
        {...chartSetting}
      />
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</div>

    </>
  );
};
