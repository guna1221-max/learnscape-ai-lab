import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function KirchhoffCard() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to="/eee/kirchhoff">
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
          <span className="text-4xl">⚡</span>
          <Badge className="absolute top-2 right-2" variant="secondary">Intermediate</Badge>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">BEEE</Badge>
            <span className="text-sm text-muted-foreground">25 min</span>
          </div>
          <h3 className="font-semibold">Kirchhoff's Laws (KVL/KCL)</h3>
          <CardDescription>Verify Kirchhoff's Voltage and Current Laws in multi-loop circuits</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}
