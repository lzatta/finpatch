import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockAccounts } from "@/lib/mock-data";
import { CheckCircle, AlertTriangle, Loader } from "lucide-react";
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export function OpenFinanceIntegration() {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const handleImport = () => {
    setIsImporting(true);
    setImportProgress(0);
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          toast.success('Importação concluída com sucesso!');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integração Open Finance</CardTitle>
        <CardDescription>Conecte suas contas para uma visão completa.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-primary/10 mb-4">
          <p className="text-sm text-muted-foreground">Saldo Total Consolidado</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="space-y-4 mb-4">
          {mockAccounts.map(account => (
            <div key={account.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-grow">
                <p className="font-semibold">{account.bank} - {account.name}</p>
                <p className="text-sm text-muted-foreground">Última sincronização: {account.lastSync}</p>
              </div>
              {account.status === 'connected' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {account.status === 'syncing' && <Loader className="h-5 w-5 text-blue-500 animate-spin" />}
              {account.status === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
            </div>
          ))}
        </div>
        {isImporting ? (
          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">Importando transações...</p>
            <Progress value={importProgress} />
          </div>
        ) : (
          <Button className="w-full" onClick={handleImport}>Importação Automática</Button>
        )}
      </CardContent>
    </Card>
  );
}
