
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { TorsionalPendulumSimulation } from '@/components/simulations/physics/TorsionalPendulumSimulation';
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
  TestTube,
  Circle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TorsionalPendulumLab = () => {
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
  const torsionalPendulumQuestions: Question[] = [
    {
      id: 'tp1',
      text: 'What happens to the period of a torsional pendulum if we double its moment of inertia?',
      options: [
        'The period doubles',
        'The period increases by a factor of √2',
        'The period stays the same',
        'The period becomes half'
      ],
      correctAnswer: 1,
      explanation: 'The period of a torsional pendulum is proportional to the square root of its moment of inertia. So if we double the moment of inertia, the period increases by a factor of √2.'
    },
    {
      id: 'tp2',
      text: 'How does increasing the torsional constant affect the period of oscillation?',
      options: [
        'Increases the period',
        'Decreases the period',
        'Has no effect on the period',
        'Makes the period unpredictable'
      ],
      correctAnswer: 1,
      explanation: 'The period of a torsional pendulum is inversely proportional to the square root of the torsional constant. So increasing the torsional constant decreases the period.'
    },
    {
      id: 'tp3',
      text: 'What is the effect of damping in a torsional pendulum system?',
      options: [
        'It increases the frequency',
        'It decreases the amplitude over time',
        'It increases the amplitude over time',
        'It has no effect on the motion'
      ],
      correctAnswer: 1,
      explanation: 'Damping causes the oscillations to decrease in amplitude over time as energy is dissipated from the system.'
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
              <Link to="/physics">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Physics Lab: Torsional Pendulum</h1>
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
                  <h2 className="text-xl font-semibold mb-4">Torsional Pendulum Simulation</h2>
                  <TorsionalPendulumSimulation />
                </div>
              </TabsContent>
              
              {/* Theory Tab */}
              <TabsContent value="theory" className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Torsional Pendulum Theory</h2>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      A torsional pendulum consists of an object suspended from a wire or rod that provides a restoring torque when twisted. When displaced from equilibrium by twisting and then released, the system oscillates with angular harmonic motion.
                    </p>
                    
                    <h3 className="text-lg font-medium mt-4">Key Equations</h3>
                    <div className="bg-muted rounded-lg p-4 my-4 overflow-x-auto">
                      <p><strong>Period of oscillation:</strong> T = 2π√(I/κ)</p>
                      <p className="mt-2">Where:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>T is the period (time for one complete oscillation)</li>
                        <li>I is the moment of inertia of the suspended object</li>
                        <li>κ (kappa) is the torsional constant of the wire/support</li>
                      </ul>
                      
                      <p className="mt-4"><strong>Differential equation of motion:</strong> I(d²θ/dt²) + c(dθ/dt) + κθ = 0</p>
                      <p className="mt-2">Where:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>θ is the angular displacement</li>
                        <li>c is the damping coefficient</li>
                      </ul>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-4">Important Concepts</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li><strong>Moment of Inertia:</strong> A measure of an object's resistance to changes in rotational motion.</li>
                      <li><strong>Torsional Constant:</strong> A property of the suspension wire that determines the restoring torque per unit angular displacement.</li>
                      <li><strong>Damping:</strong> Energy dissipation that reduces the amplitude of oscillations over time.</li>
                      <li><strong>Resonance:</strong> The phenomenon where the system oscillates with maximum amplitude at specific frequencies.</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-4">Applications</h3>
                    <p>
                      Torsional pendulums are used in various applications including:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Measuring the moment of inertia of objects</li>
                      <li>Studying rotational dynamics and damping effects</li>
                      <li>Historical clocks and timekeeping devices</li>
                      <li>Torsional balances for measuring extremely small forces</li>
                      <li>Seismic instruments for detecting rotational ground movements</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              {/* Quiz Tab */}
              <TabsContent value="quiz" className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  {!quizStarted ? (
                    <div className="text-center py-8">
                      <Circle className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h2 className="text-xl font-semibold mb-2">Torsional Pendulum Quiz</h2>
                      <p className="mb-6 text-muted-foreground">
                        Test your understanding of torsional pendulum physics with this short quiz.
                      </p>
                      <Button onClick={() => setQuizStarted(true)}>
                        Start Quiz
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Torsional Pendulum Quiz</h2>
                        <div className="text-sm">
                          Score: {quizResults.correct}/{quizResults.total}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {torsionalPendulumQuestions.map((question) => (
                          <QuizCard
                            key={question.id}
                            question={question}
                            onAnswer={handleQuizAnswer}
                          />
                        ))}
                      </div>
                      
                      {quizResults.answered.length === torsionalPendulumQuestions.length && (
                        <div className="mt-8 p-6 bg-muted rounded-lg text-center">
                          <h3 className="text-lg font-semibold mb-2">
                            Quiz Completed!
                          </h3>
                          <p className="mb-4">
                            You scored {quizResults.correct} out of {torsionalPendulumQuestions.length} questions correctly.
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
              <AiChatbox context="Torsional Pendulum Experiment" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TorsionalPendulumLab;
