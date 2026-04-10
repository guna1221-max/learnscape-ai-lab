import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function WheatstoneCard() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to="/eee/wheatstone">
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
          <span className="text-4xl">🔷</span>
          <Badge className="absolute top-2 right-2" variant="default">Beginner</Badge>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">BEEE</Badge>
            <span className="text-sm text-muted-foreground">20 min</span>
          </div>
          <h3 className="font-semibold">Wheatstone Bridge</h3>
          <CardDescription>Measure unknown resistance using the balanced bridge principle</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}
