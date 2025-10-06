"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from "@/lib/utils";

// Data for Pie Chart
const pieData = [
  { name: 'Alimentação', value: 400, color: 'hsl(var(--chart-1))' },
  { name: 'Moradia', value: 1200, color: 'hsl(var(--chart-2))' },
  { name: 'Transporte', value: 300, color: 'hsl(var(--chart-3))' },
  { name: 'Lazer', value: 250, color: 'hsl(var(--chart-4))' },
  { name: 'Saúde', value: 150, color: 'hsl(var(--chart-5))' },
];

// Data for Line Chart
const lineData = [
  { name: 'Jan', saldo: 8500 },
  { name: 'Fev', saldo: 9200 },
  { name: 'Mar', saldo: 8800 },
  { name: 'Abr', saldo: 9500 },
  { name: 'Mai', saldo: 10500 },
  { name: 'Jun', saldo: 11800 },
  { name: 'Jul', saldo: 12540 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {payload[0].name === 'saldo' ? 'Mês' : 'Categoria'}
            </span>
            <span className="font-bold text-muted-foreground">
              {label}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {payload[0].name === 'saldo' ? 'Saldo' : 'Valor'}
            </span>
            <span className="font-bold">
              {formatCurrency(payload[0].value)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function DashboardCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Distribuição dos seus gastos neste mês.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Evolução Mensal do Saldo</CardTitle>
          <CardDescription>Seu saldo acumulado ao longo do ano.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatCurrency(value/1000)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="saldo" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
