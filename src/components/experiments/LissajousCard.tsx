import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function LissajousCard() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to="/eee/lissajous">
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-lime-500/20 to-green-500/20 flex items-center justify-center">
          <span className="text-4xl">🌀</span>
          <Badge className="absolute top-2 right-2" variant="secondary">Intermediate</Badge>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">BEEE</Badge>
            <span className="text-sm text-muted-foreground">20 min</span>
          </div>
          <h3 className="font-semibold">Lissajous Figures (CRO)</h3>
          <CardDescription>Generate Lissajous patterns to compare frequencies and phase differences</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}
