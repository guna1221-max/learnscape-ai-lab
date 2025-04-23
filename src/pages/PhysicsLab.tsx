
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PendulumSimulation } from '@/components/simulations/physics/PendulumSimulation';
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

const PhysicsLab = () => {
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
  const pendulumQuestions: Question[] = [
    {
      id: 'p1',
      text: 'What happens to the period of a pendulum if we double its length?',
      options: [
        'The period doubles',
        'The period increases by a factor of √2',
        'The period stays the same',
        'The period becomes half'
      ],
      correctAnswer: 1,
      explanation: 'The period of a pendulum is proportional to the square root of its length. So if we double the length, the period increases by a factor of √2.'
    },
    {
      id: 'p2',
      text: 'How does gravity affect the period of a pendulum?',
      options: [
        'Increasing gravity increases the period',
        'Increasing gravity decreases the period',
        'Gravity has no effect on the period',
        'The effect depends on the pendulum length'
      ],
      correctAnswer: 1,
      explanation: 'The period of a pendulum is inversely proportional to the square root of gravity. So increasing gravity decreases the period.'
    },
    {
      id: 'p3',
      text: 'Which of the following does NOT affect the period of a simple pendulum?',
      options: [
        'Length of the pendulum',
        'Mass of the bob',
        'Gravitational field strength',
        'Amplitude (for small angles)'
      ],
      correctAnswer: 1,
      explanation: 'For a simple pendulum, the mass does not affect the period. The period depends only on length, gravity, and for large angles, the amplitude.'
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
            <h1 className="text-2xl font-bold">Physics Lab: Simple Pendulum</h1>
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
                  <h2 className="text-xl font-semibold mb-4">Simple Pendulum Simulation</h2>
                  <PendulumSimulation />
                </div>
              </TabsContent>
              
              {/* Theory Tab */}
              <TabsContent value="theory" className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Simple Pendulum Theory</h2>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      A simple pendulum consists of a mass (bob) attached to a lightweight cord suspended from a fixed point. When displaced from equilibrium and released, the pendulum will swing back and forth with periodic motion.
                    </p>
                    
                    <h3 className="text-lg font-medium mt-4">Key Equations</h3>
                    <div className="bg-muted rounded-lg p-4 my-4 overflow-x-auto">
                      <p><strong>Period of oscillation (small angles):</strong> T = 2π√(L/g)</p>
                      <p className="mt-2">Where:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>T is the period (time for one complete oscillation)</li>
                        <li>L is the length of the pendulum</li>
                        <li>g is the gravitational field strength</li>
                      </ul>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-4">Important Concepts</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li><strong>Isochronism:</strong> For small amplitudes, the period of a pendulum is approximately independent of amplitude.</li>
                      <li><strong>Simple Harmonic Motion:</strong> For small angles, the pendulum follows simple harmonic motion.</li>
                      <li><strong>Energy Conversion:</strong> Energy continuously converts between kinetic and potential forms during oscillation.</li>
                      <li><strong>Damping:</strong> In real pendulums, friction and air resistance cause the amplitude to decrease over time.</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-4">Applications</h3>
                    <p>
                      Pendulums have been used in clocks, as seismic instruments, and to demonstrate Earth's rotation (Foucault pendulum). The principles of pendulum motion are fundamental to understanding oscillatory systems in physics.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Quiz Tab */}
              <TabsContent value="quiz" className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  {!quizStarted ? (
                    <div className="text-center py-8">
                      <TestTube className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h2 className="text-xl font-semibold mb-2">Pendulum Physics Quiz</h2>
                      <p className="mb-6 text-muted-foreground">
                        Test your understanding of pendulum physics with this short quiz.
                      </p>
                      <Button onClick={() => setQuizStarted(true)}>
                        Start Quiz
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Pendulum Physics Quiz</h2>
                        <div className="text-sm">
                          Score: {quizResults.correct}/{quizResults.total}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {pendulumQuestions.map((question) => (
                          <QuizCard
                            key={question.id}
                            question={question}
                            onAnswer={handleQuizAnswer}
                          />
                        ))}
                      </div>
                      
                      {quizResults.answered.length === pendulumQuestions.length && (
                        <div className="mt-8 p-6 bg-muted rounded-lg text-center">
                          <h3 className="text-lg font-semibold mb-2">
                            Quiz Completed!
                          </h3>
                          <p className="mb-4">
                            You scored {quizResults.correct} out of {pendulumQuestions.length} questions correctly.
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
              <AiChatbox context="Simple Pendulum Experiment" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PhysicsLab;
