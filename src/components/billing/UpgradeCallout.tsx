import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import UpgradeCTACompact from "./upgrade-cta-compact";

interface UpgradeCalloutProps {
    feature: string;
}

export function UpgradeCallout({ feature }: UpgradeCalloutProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Recurso Premium
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                <p className="text-muted-foreground">
                    A funcionalidade de <span className="font-semibold text-foreground">{feature}</span> está disponível apenas nos planos Premium.
                </p>
                <UpgradeCTACompact buttonText="Ver Planos" />
            </CardContent>
        </Card>
    )
}
