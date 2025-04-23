
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CellSimulation } from '@/components/simulations/biology/CellSimulation';
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
  Play, 
  BookOpen,
  TestTube
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BiologyLab = () => {
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
  
  // Sample quiz questions
  const cellQuestions: Question[] = [
    {
      id: 'c1',
      text: 'Which process allows small, nonpolar molecules to pass through the cell membrane without requiring energy?',
      options: [
        'Active transport',
        'Simple diffusion',
        'Facilitated diffusion',
        'Endocytosis'
      ],
      correctAnswer: 1,
      explanation: 'Simple diffusion is the process where small, nonpolar molecules move from an area of higher concentration to an area of lower concentration without requiring energy or transport proteins.'
    },
    {
      id: 'c2',
      text: 'What property of the phospholipid bilayer makes it selectively permeable?',
      options: [
        'Its negatively charged surface',
        'Its hydrophilic interior and hydrophobic exterior',
        'Its hydrophobic interior and hydrophilic exterior',
        'Its ability to change shape'
      ],
      correctAnswer: 2,
      explanation: 'The phospholipid bilayer has a hydrophobic interior (fatty acid tails) and hydrophilic exterior (phosphate heads), making it permeable to nonpolar molecules but impermeable to many polar molecules and ions.'
    },
    {
      id: 'c3',
      text: 'Which factor does NOT affect the rate of diffusion across a cell membrane?',
      options: [
        'Concentration gradient',
        'Temperature',
        'Molecular weight of the substance',
        'Color of the substance'
      ],
      correctAnswer: 3,
      explanation: 'The color of a substance has no effect on its diffusion rate. Factors that affect diffusion include concentration gradient, temperature, molecular size and shape, and membrane permeability.'
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
            <h1 className="text-2xl font-bold">Biology Lab: Cell Membrane Transport</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="simulation" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
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
                <div className="simulation-container p-4">
                  <h2 className="text-xl font-semibold mb-4">Cell Membrane Transport Simulation</h2>
                  <CellSimulation />
                </div>
              </TabsContent>
              
              {/* Theory Tab */}
              <TabsContent value="theory" className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Cell Membrane Transport Theory</h2>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      The cell membrane is a selectively permeable barrier that controls what enters and exits the cell. This selectivity is essential for maintaining homeostasis and proper cell function.
                    </p>
                    
                    <h3 className="text-lg font-medium mt-4">Types of Membrane Transport</h3>
                    <div className="bg-muted rounded-lg p-4 my-4">
                      <h4 className="font-medium">Passive Transport (No Energy Required)</h4>
                      <ul className="list-disc list-inside mt-2">
                        <li><strong>Simple Diffusion:</strong> Movement of small, nonpolar molecules from high to low concentration</li>
                        <li><strong>Facilitated Diffusion:</strong> Movement of polar molecules and ions through transport proteins</li>
                        <li><strong>Osmosis:</strong> Diffusion of water across a membrane</li>
                      </ul>
                      
                      <h4 className="font-medium mt-3">Active Transport (Energy Required)</h4>
                      <ul className="list-disc list-inside mt-2">
                        <li><strong>Primary Active Transport:</strong> Directly uses ATP to move molecules against concentration gradient</li>
                        <li><strong>Secondary Active Transport:</strong> Uses ion gradients created by primary active transport</li>
                        <li><strong>Vesicular Transport:</strong> Includes endocytosis and exocytosis for large molecules</li>
                      </ul>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-4">Cell Membrane Structure</h3>
                    <p>
                      The cell membrane consists of a phospholipid bilayer with embedded proteins. The phospholipids have hydrophilic heads facing the aqueous environments inside and outside the cell, and hydrophobic tails facing inward. This structure makes the membrane selectively permeable.
                    </p>
                    
                    <h3 className="text-lg font-medium mt-4">Factors Affecting Transport Rate</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li><strong>Concentration Gradient:</strong> Larger gradients lead to faster diffusion</li>
                      <li><strong>Temperature:</strong> Higher temperatures increase molecular motion and diffusion rates</li>
                      <li><strong>Membrane Surface Area:</strong> Larger surface areas allow more molecules to pass simultaneously</li>
                      <li><strong>Molecular Size and Polarity:</strong> Small, nonpolar molecules diffuse more easily</li>
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
                      <h2 className="text-xl font-semibold mb-2">Cell Membrane Transport Quiz</h2>
                      <p className="mb-6 text-muted-foreground">
                        Test your understanding of cell membrane transport processes.
                      </p>
                      <Button onClick={() => setQuizStarted(true)}>
                        Start Quiz
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Cell Membrane Transport Quiz</h2>
                        <div className="text-sm">
                          Score: {quizResults.correct}/{quizResults.total}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {cellQuestions.map((question) => (
                          <QuizCard
                            key={question.id}
                            question={question}
                            onAnswer={handleQuizAnswer}
                          />
                        ))}
                      </div>
                      
                      {quizResults.answered.length === cellQuestions.length && (
                        <div className="mt-8 p-6 bg-muted rounded-lg text-center">
                          <h3 className="text-lg font-semibold mb-2">
                            Quiz Completed!
                          </h3>
                          <p className="mb-4">
                            You scored {quizResults.correct} out of {cellQuestions.length} questions correctly.
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
              <AiChatbox context="Cell Membrane Transport Experiment" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BiologyLab;
