import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function NortonCard() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to="/eee/norton">
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
          <span className="text-4xl">🔌</span>
          <Badge className="absolute top-2 right-2" variant="secondary">Intermediate</Badge>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">BEEE</Badge>
            <span className="text-sm text-muted-foreground">25 min</span>
          </div>
          <h3 className="font-semibold">Norton's Theorem</h3>
          <CardDescription>Find Norton equivalent current source and resistance for complex networks</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}
