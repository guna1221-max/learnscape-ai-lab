
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

type ExperimentDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface ExperimentCardProps {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: ExperimentDifficulty;
  duration: string;
  path: string;
}

export function ExperimentCard({ 
  title, 
  description, 
  imageUrl, 
  category, 
  difficulty, 
  duration,
  path 
}: ExperimentCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={path}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <Badge 
            className="absolute top-2 right-2"
            variant={
              difficulty === 'Beginner' ? 'default' :
              difficulty === 'Intermediate' ? 'secondary' :
              'destructive'
            }
          >
            {difficulty}
          </Badge>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{category}</Badge>
            <span className="text-sm text-muted-foreground">{duration}</span>
          </div>
          <h3 className="font-semibold">{title}</h3>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}
