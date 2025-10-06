export default function EmptyDashboard(){
  return (
    <div className="grid gap-4">
      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground mb-1">Saúde Financeira</p>
        <h3 className="text-2xl font-semibold">0/100</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Previsão Próximo Mês</p>
          <h3 className="text-2xl font-semibold">R$ 0,00</h3>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Taxa de Poupança</p>
          <h3 className="text-2xl font-semibold">0%</h3>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Alertas IA</p>
          <h3 className="text-2xl font-semibold">0</h3>
        </div>
      </div>
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Sem dados ainda. Adicione transações, metas ou conecte-se para ver seus gráficos.
      </div>
    </div>
  );
}
