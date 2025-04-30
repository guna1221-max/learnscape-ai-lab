
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function TorsionalPendulumCard() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to="/physics/torsional-pendulum">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000" 
            alt="Torsional Pendulum" 
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <Badge 
            className="absolute top-2 right-2"
            variant="secondary"
          >
            Intermediate
          </Badge>
        </div>
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <Badge variant="outline">Physics</Badge>
            <span className="text-sm text-muted-foreground">20 minutes</span>
          </div>
          <h3 className="font-semibold">Torsional Pendulum</h3>
          <p className="text-sm text-muted-foreground">
            Explore rotational motion and oscillations with a torsional pendulum system and analyze the factors affecting its period.
          </p>
        </div>
      </Link>
    </Card>
  );
}
