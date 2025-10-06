import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

const areaData = [
  { month: 'Jan', savings: 1200 },
  { month: 'Fev', savings: 1500 },
  { month: 'Mar', savings: 1400 },
  { month: 'Abr', savings: 2100 },
  { month: 'Mai', savings: 2500 },
  { month: 'Jun', savings: 3200 },
];

const pieData = [
  { name: 'Moradia', value: 1500, color: 'hsl(var(--chart-1))' },
  { name: 'Alimentação', value: 800, color: 'hsl(var(--chart-2))' },
  { name: 'Transporte', value: 400, color: 'hsl(var(--chart-3))' },
  { name: 'Lazer', value: 500, color: 'hsl(var(--chart-4))' },
  { name: 'Outros', value: 300, color: 'hsl(var(--chart-5))' },
];

export function ProfileStats() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Economia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(value) => `${formatCurrency(value/1000)}k`} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Economia']} />
              <Legend />
              <Area type="monotone" dataKey="savings" name="Economia" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSavings)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
