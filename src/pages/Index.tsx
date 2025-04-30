
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { ExperimentCard } from '@/components/experiments/ExperimentCard';
import { NewtonRingsCard } from '@/components/experiments/NewtonRingsCard';
import { TorsionalPendulumCard } from '@/components/experiments/TorsionalPendulumCard';
import { SonometerCard } from '@/components/experiments/SonometerCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { School, FlaskConical, Microscope, BookOpen, Beaker } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Sample experiment data
  const experiments = [
    {
      id: '1',
      title: 'Simple Pendulum',
      description: 'Explore the physics of pendulum motion and how parameters like length and gravity affect the period.',
      imageUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=1000',
      category: 'Physics',
      difficulty: 'Beginner' as const,
      duration: '15 minutes',
      path: '/physics'
    },
    {
      id: '2',
      title: 'Cell Membrane Transport',
      description: 'Visualize how molecules move across cell membranes through diffusion and active transport.',
      imageUrl: 'https://images.unsplash.com/photo-1576086387438-486c6d5a1bb8?q=80&w=1000',
      category: 'Biology',
      difficulty: 'Intermediate' as const,
      duration: '20 minutes',
      path: '/biology'
    },
    {
      id: '3',
      title: 'Wave Interference',
      description: 'Investigate how waves interact with each other through constructive and destructive interference.',
      imageUrl: 'https://images.unsplash.com/photo-1608108707926-8f14abd56336?q=80&w=1000',
      category: 'Physics',
      difficulty: 'Advanced' as const,
      duration: '25 minutes',
      path: '/physics'
    },
    {
      id: '4',
      title: 'DNA Replication',
      description: 'Explore the process of DNA replication and the enzymes involved in creating new DNA strands.',
      imageUrl: 'https://images.unsplash.com/photo-1584555613483-2a0e0a1bb911?q=80&w=1000',
      category: 'Biology',
      difficulty: 'Advanced' as const,
      duration: '30 minutes',
      path: '/biology'
    },
    {
      id: '5',
      title: 'Chemical Reactions',
      description: 'Investigate reaction rates and the factors affecting chemical kinetics in this interactive simulation.',
      imageUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=1000',
      category: 'Chemistry',
      difficulty: 'Intermediate' as const,
      duration: '20 minutes',
      path: '/chemistry'
    }
  ];
  
  const filteredExperiments = activeTab === 'all' 
    ? experiments 
    : experiments.filter(exp => exp.category.toLowerCase() === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-8">
        {/* Hero section */}
        <section className="mb-12">
          <div className="text-center space-y-4">
            <School className="h-16 w-16 mx-auto text-primary mb-2" />
            <h1 className="text-4xl font-bold tracking-tight">
              Creative<span className="text-primary">thinkers</span> Lab
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interactive simulations and AI-powered tutoring for Physics, Chemistry, and Biology experiments
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button asChild size="lg" className="gap-2">
                <Link to="/physics">
                  <FlaskConical className="h-5 w-5" />
                  Physics Lab
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/chemistry">
                  <Beaker className="h-5 w-5" />
                  Chemistry Lab
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/biology">
                  <Microscope className="h-5 w-5" />
                  Biology Lab
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured experiments */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Featured Experiments</h2>
            <Button variant="ghost" asChild>
              <Link to="/experiments" className="flex items-center gap-2">
                <span>View all</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </Button>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Experiments</TabsTrigger>
              <TabsTrigger value="physics">Physics</TabsTrigger>
              <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
              <TabsTrigger value="biology">Biology</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredExperiments.map((experiment) => (
                  <ExperimentCard
                    key={experiment.id}
                    title={experiment.title}
                    description={experiment.description}
                    imageUrl={experiment.imageUrl}
                    category={experiment.category}
                    difficulty={experiment.difficulty}
                    duration={experiment.duration}
                    path={experiment.path}
                  />
                ))}
                {/* Add experiment cards directly to ensure they appear */}
                <NewtonRingsCard />
                <TorsionalPendulumCard />
                <SonometerCard />
              </div>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* AI Tutor Section */}
        <section className="mb-12">
          <div className="bg-muted rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  AI Tutor Assistance
                </h2>
                <p className="text-muted-foreground mb-6">
                  Get personalized help from our AI tutor while running experiments. Ask questions, get explanations and deepen your understanding of scientific concepts.
                </p>
                <Button asChild>
                  <Link to="/tutor" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Chat with AI Tutor
                  </Link>
                </Button>
              </div>
              <div className="flex-1">
                <div className="aspect-video bg-card rounded-lg border overflow-hidden flex items-center justify-center">
                  <div className="text-center p-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      The AI Tutor helps you understand complex concepts and guides you through experiments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 bg-muted/50">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Creative<span className="text-primary">thinkers</span> Lab
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Interactive science simulations with AI tutoring
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
