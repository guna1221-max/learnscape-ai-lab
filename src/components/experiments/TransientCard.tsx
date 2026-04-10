import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function TransientCard() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to="/eee/transient">
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
          <span className="text-4xl">📈</span>
          <Badge className="absolute top-2 right-2" variant="destructive">Advanced</Badge>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">BEEE</Badge>
            <span className="text-sm text-muted-foreground">30 min</span>
          </div>
          <h3 className="font-semibold">Transient Response (RC/RL/RLC)</h3>
          <CardDescription>Analyze step response and time constants of RC, RL, and RLC circuits</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}
