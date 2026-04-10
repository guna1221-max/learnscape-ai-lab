
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { ExperimentCard } from '@/components/experiments/ExperimentCard';
import { NewtonRingsCard } from '@/components/experiments/NewtonRingsCard';
import { TorsionalPendulumCard } from '@/components/experiments/TorsionalPendulumCard';
import { SonometerCard } from '@/components/experiments/SonometerCard';
import { BHCurveCard } from '@/components/experiments/BHCurveCard';
import { RLCCircuitCard } from '@/components/experiments/RLCCircuitCard';
import { TheveninCard } from '@/components/experiments/TheveninCard';
import { SuperpositionCard } from '@/components/experiments/SuperpositionCard';
import { TransformerCard } from '@/components/experiments/TransformerCard';
import { KirchhoffCard } from '@/components/experiments/KirchhoffCard';
import { NortonCard } from '@/components/experiments/NortonCard';
import { MaxPowerCard } from '@/components/experiments/MaxPowerCard';
import { WheatstoneCard } from '@/components/experiments/WheatstoneCard';
import { StarDeltaCard } from '@/components/experiments/StarDeltaCard';
import { TransientCard } from '@/components/experiments/TransientCard';
import { PowerFactorCard } from '@/components/experiments/PowerFactorCard';
import { LissajousCard } from '@/components/experiments/LissajousCard';
import { MeshNodalCard } from '@/components/experiments/MeshNodalCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { School, FlaskConical, BookOpen, Code, Zap } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const experiments = [
    {
      id: '1',
      title: 'Simple Pendulum',
      description: 'Explore the physics of pendulum motion and how parameters like length and gravity affect the period.',
      imageUrl: '/images/experiments/simple-pendulum.jpg',
      category: 'Physics',
      difficulty: 'Beginner' as const,
      duration: '15 minutes',
      path: '/physics'
    },
    {
      id: '2',
      title: 'Algorithm Complexity Analysis',
      description: 'Analyze time and space complexity of various algorithms with interactive visualizations.',
      imageUrl: '/images/experiments/algorithm-analysis.jpg',
      category: 'Algorithms',
      difficulty: 'Intermediate' as const,
      duration: '20 minutes',
      path: '/algorithms'
    },
    {
      id: '3',
      title: 'Wave Interference',
      description: 'Investigate how waves interact with each other through constructive and destructive interference.',
      imageUrl: '/images/experiments/wave-interference.jpg',
      category: 'Physics',
      difficulty: 'Advanced' as const,
      duration: '25 minutes',
      path: '/physics'
    },
    {
      id: '4',
      title: 'Sorting Algorithm Visualization',
      description: 'Compare different sorting algorithms and understand their performance characteristics.',
      imageUrl: '/images/experiments/sorting-algorithms.jpg',
      category: 'Algorithms',
      difficulty: 'Advanced' as const,
      duration: '30 minutes',
      path: '/algorithms'
    },
  ];
  
  const filteredExperiments = activeTab === 'all' 
    ? experiments 
    : experiments.filter(exp => exp.category.toLowerCase() === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <section className="mb-12">
          <div className="text-center space-y-4">
            <School className="h-16 w-16 mx-auto text-primary mb-2" />
            <h1 className="text-4xl font-bold tracking-tight">
              Creative<span className="text-primary">thinkers</span> Lab
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interactive simulations and AI-powered tutoring for Physics, EEE, and Algorithm Analysis
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button asChild size="lg" className="gap-2">
                <Link to="/physics">
                  <FlaskConical className="h-5 w-5" />
                  Physics Lab
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/eee/rlc-circuit">
                  <Zap className="h-5 w-5" />
                  EEE Lab
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/algorithms">
                  <Code className="h-5 w-5" />
                  Algorithm Lab
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Featured Experiments</h2>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Experiments</TabsTrigger>
              <TabsTrigger value="physics">Physics</TabsTrigger>
              <TabsTrigger value="beee">BEEE / EEE</TabsTrigger>
              <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
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
                {(activeTab === 'all' || activeTab === 'physics') && (
                  <>
                    <NewtonRingsCard />
                    <TorsionalPendulumCard />
                    <SonometerCard />
                  </>
                )}
                {(activeTab === 'all' || activeTab === 'beee') && (
                  <>
                    <BHCurveCard />
                    <RLCCircuitCard />
                    <TheveninCard />
                    <SuperpositionCard />
                    <TransformerCard />
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        
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
