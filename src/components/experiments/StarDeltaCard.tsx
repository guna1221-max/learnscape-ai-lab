import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function StarDeltaCard() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to="/eee/star-delta">
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <span className="text-4xl">⭐</span>
          <Badge className="absolute top-2 right-2" variant="secondary">Intermediate</Badge>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">BEEE</Badge>
            <span className="text-sm text-muted-foreground">20 min</span>
          </div>
          <h3 className="font-semibold">Star-Delta Transformation</h3>
          <CardDescription>Convert between star (Y) and delta (Δ) resistor configurations</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}
