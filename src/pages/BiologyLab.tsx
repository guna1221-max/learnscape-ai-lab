
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BiologyLab = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container flex-1 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Biology Lab</h1>
          </div>
        </div>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Biology simulations coming soon! Check back later for interactive cell biology experiments.
          </p>
        </div>
      </main>
    </div>
  );
};

export default BiologyLab;
