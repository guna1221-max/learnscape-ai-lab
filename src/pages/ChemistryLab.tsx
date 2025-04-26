
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ChemicalReactionSimulation } from '@/components/simulations/chemistry/ChemicalReactionSimulation';
import { AiChatbox } from '@/components/tutor/AiChatbox';
import { QuizCard, Question } from '@/components/quizzes/QuizCard';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Beaker, 
  BookOpen,
  TestTube
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SimulationController } from '@/components/simulations/SimulationController';

const ChemistryLab = () => {
  const [activeTab, setActiveTab] = useState('simulation');
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    correct: number;
    total: number;
    answered: string[];
  }>({
    correct: 0,
    total: 0,
    answered: []
  });
  
  // Sample quiz questions for chemical reactions
  const chemicalReactionQuestions: Question[] = [
    {
      id: 'c1',
      text: 'Which factor does NOT typically increase the rate of a chemical reaction?',
      options: [
        'Increasing the temperature',
        'Decreasing the concentration of reactants',
        'Adding a catalyst',
        'Increasing the surface area of solid reactants'
      ],
      correctAnswer: 1,
      explanation: 'Decreasing the concentration of reactants typically reduces the frequency of molecular collisions, thus slowing down the reaction rate. All other options increase reaction rates.'
    },
    {
      id: 'c2',
      text: 'What is the role of a catalyst in a chemical reaction?',
      options: [
        'It increases the yield of products',
        'It decreases the activation energy',
        'It adds more energy to the reaction',
        'It changes the chemical composition of the products'
      ],
      correctAnswer: 1,
      explanation: 'A catalyst works by providing an alternative reaction pathway with lower activation energy, thus increasing the rate of reaction without being consumed in the process.'
    },
    {
      id: 'c3',
      text: 'In the collision theory of reaction rates, which of the following is necessary for a successful reaction to occur?',
      options: [
        'Molecules must collide with proper orientation',
        'All collisions result in reactions',
        'Reactions always occur at the same rate',
        'Activation energy is not required'
      ],
      correctAnswer: 0,
      explanation: 'According to collision theory, molecules must collide with sufficient energy (greater than the activation energy) AND with proper orientation for a reaction to occur.'
    }
  ];
  
  const handleQuizAnswer = (isCorrect: boolean, questionId: string) => {
    setQuizResults(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.answered.includes(questionId) ? prev.total : prev.total + 1,
      answered: [...prev.answered.filter(id => id !== questionId), questionId]
    }));
  };
  
  const resetQuiz = () => {
    setQuizResults({
      correct: 0,
      total: 0,
      answered: []
    });
    setQuizStarted(false);
  };

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
            <h1 className="text-2xl font-bold">Chemistry Lab: Chemical Reactions</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="simulation" className="flex items-center gap-2">
                  <Beaker className="h-4 w-4" />
                  <span>Simulation</span>
                </TabsTrigger>
                <TabsTrigger value="theory" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Theory</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  <span>Quiz</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Simulation Tab */}
              <TabsContent value="simulation" className="space-y-6">
                <div className="simulation-container">
                  <SimulationController 
                    type="chemistry" 
                    title="Chemical Reaction Kinetics" 
                    description="Explore how temperature and reaction parameters affect reaction rates."
                  />
                </div>
              </TabsContent>
              
              {/* Theory Tab */}
              <TabsContent value="theory" className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Chemical Reaction Theory</h2>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      Chemical reactions involve the transformation of reactants into products through the breaking and forming of chemical bonds. The study of reaction rates (kinetics) is fundamental to understanding chemical processes.
                    </p>
                    
                    <h3 className="text-lg font-medium mt-4">Collision Theory</h3>
                    <p>
                      According to collision theory, reactions occur when:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Molecules collide with each other</li>
                      <li>They collide with sufficient energy (activation energy)</li>
                      <li>They collide with proper orientation</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-4">Factors Affecting Reaction Rates</h3>
                    <div className="bg-muted rounded-lg p-4 my-4">
                      <ol className="list-decimal list-inside">
                        <li><strong>Temperature:</strong> Higher temperatures increase average kinetic energy, leading to more successful collisions</li>
                        <li><strong>Concentration:</strong> Higher concentrations increase collision frequency</li>
                        <li><strong>Surface Area:</strong> Greater surface area increases collision opportunities</li>
                        <li><strong>Catalysts:</strong> Reduce activation energy, providing alternative reaction pathways</li>
                        <li><strong>Nature of Reactants:</strong> Some substances naturally react more readily than others</li>
                      </ol>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-4">Reaction Energy Diagrams</h3>
                    <p>
                      Energy diagrams illustrate the energy changes during reactions:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Activation energy is the minimum energy needed to start a reaction</li>
                      <li>Exothermic reactions release energy (products have lower energy than reactants)</li>
                      <li>Endothermic reactions absorb energy (products have higher energy than reactants)</li>
                      <li>Catalysts lower the activation energy but don't change the overall energy change</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              {/* Quiz Tab */}
              <TabsContent value="quiz" className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  {!quizStarted ? (
                    <div className="text-center py-8">
                      <TestTube className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h2 className="text-xl font-semibold mb-2">Chemical Reactions Quiz</h2>
                      <p className="mb-6 text-muted-foreground">
                        Test your understanding of chemical reaction kinetics with this short quiz.
                      </p>
                      <Button onClick={() => setQuizStarted(true)}>
                        Start Quiz
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Chemical Reactions Quiz</h2>
                        <div className="text-sm">
                          Score: {quizResults.correct}/{quizResults.total}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {chemicalReactionQuestions.map((question) => (
                          <QuizCard
                            key={question.id}
                            question={question}
                            onAnswer={handleQuizAnswer}
                          />
                        ))}
                      </div>
                      
                      {quizResults.answered.length === chemicalReactionQuestions.length && (
                        <div className="mt-8 p-6 bg-muted rounded-lg text-center">
                          <h3 className="text-lg font-semibold mb-2">
                            Quiz Completed!
                          </h3>
                          <p className="mb-4">
                            You scored {quizResults.correct} out of {chemicalReactionQuestions.length} questions correctly.
                          </p>
                          <Button onClick={resetQuiz}>
                            Restart Quiz
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* AI Tutor Chatbox */}
          <div>
            <div className="h-[600px]">
              <AiChatbox context="Chemical Reaction Kinetics Experiment" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChemistryLab;
