
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ExperimentCardProps {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
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
  // Map difficulty to appropriate color
  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  return (
    <div className="experiment-card h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="experiment-card-overlay">
          <Button variant="secondary" size="sm" asChild>
            <Link to={path}>Launch Experiment</Link>
          </Button>
        </div>
        <div className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-md">
          {category}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className={`text-xs px-2 py-1 rounded ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
          <span className="text-xs text-muted-foreground">{duration}</span>
        </div>
        <Link to={path} className="mt-4 w-full">
          <Button variant="default" size="sm" className="w-full group">
            Start Experiment
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
