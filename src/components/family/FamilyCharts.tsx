import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockFamilyMembers } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useGoalsStore } from "@/store/goals";
import { mockFamilySavingsEvolution } from "@/lib/mock-data";

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold">{payload[0].name}</p>
        <p className="text-sm text-success">{formatCurrency(payload[0].value)} ({payload[0].payload.percent}%)</p>
      </div>
    );
  }
  return null;
};

const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-bold">{label}</p>
          <p className="text-sm text-primary">Economia: {formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

export function FamilyCharts() {
  const totalExpenses = mockFamilyMembers.reduce((acc, member) => acc + (member.totalExpenses ?? 0), 0);
  const pieData = mockFamilyMembers.map(member => ({
    name: member.name,
    value: member.totalExpenses ?? 0,
    percent: totalExpenses > 0 ? (((member.totalExpenses ?? 0) / totalExpenses) * 100).toFixed(0) : 0,
  }));
  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

  const { goals } = useGoalsStore();
  const sharedGoals = goals.filter(g => g.shared);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Despesas por Membro</CardTitle>
          <CardDescription>Percentual de gastos de cada um no mês</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
              </Pie>
              <Legend formatter={(value, entry) => <span className="text-muted-foreground">{value} - {formatCurrency(entry.payload?.value ?? 0)}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Evolução da Economia Familiar</CardTitle>
          <CardDescription>Economia total da família ao longo dos meses</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mockFamilySavingsEvolution}>
                <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatCurrency(value/1000)}k`} />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area type="monotone" dataKey="savings" stroke="hsl(var(--primary))" fill="url(#colorSavings)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-5">
        <CardHeader>
            <CardTitle>Metas Compartilhadas</CardTitle>
            <CardDescription>Progresso das metas em grupo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {sharedGoals.map(goal => {
                const progress = (goal.target > 0) ? (goal.current / goal.target) * 100 : 0;
                return (
                    <div key={goal.id}>
                        <div className="flex justify-between items-baseline mb-2">
                            <p className="font-semibold">{goal.title}</p>
                            <p className="text-sm font-bold text-primary">{progress.toFixed(0)}%</p>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground">Contribuições:</span>
                            {goal.sharedWith?.map(sharedMember => {
                                const memberData = mockFamilyMembers.find(m => m.name === sharedMember.name);
                                const totalContributed = goal.contributions
                                    .filter(c => c.userId === memberData?.id)
                                    .reduce((sum, c) => sum + c.amount, 0);

                                if (totalContributed === 0) return null;

                                return (
                                    <div key={sharedMember.name} className="flex items-center gap-1.5 text-xs">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={memberData?.avatar} />
                                            <AvatarFallback>{memberData?.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{formatCurrency(totalContributed)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </CardContent>
      </Card>
    </div>
  );
}
