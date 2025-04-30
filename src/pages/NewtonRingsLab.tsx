
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SimulationController } from '@/components/simulations/SimulationController';
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
  CircleDot
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NewtonRingsLab = () => {
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
  
  // Sample quiz questions for Newton's Rings experiment
  const newtonRingsQuestions: Question[] = [
    {
      id: 'nr1',
      text: 'What physical phenomenon is responsible for the formation of Newton\'s rings?',
      options: [
        'Diffraction',
        'Interference',
        'Refraction',
        'Polarization'
      ],
      correctAnswer: 1,
      explanation: 'Newton\'s rings are formed due to interference between light waves reflected from the top and bottom surfaces of the air gap between a lens and a flat surface.'
    },
    {
      id: 'nr2',
      text: 'How does the pattern of rings change if monochromatic light of shorter wavelength (e.g., blue) is used instead of longer wavelength (e.g., red)?',
      options: [
        'The rings become wider and fewer',
        'The rings become narrower and more numerous',
        'The pattern does not change',
        'The rings disappear completely'
      ],
      correctAnswer: 1,
      explanation: 'With shorter wavelength light, the rings become narrower and more numerous. This is because the condition for constructive/destructive interference depends on the wavelength.'
    },
    {
      id: 'nr3',
      text: 'What happens to the Newton\'s rings pattern when the air gap is filled with a liquid?',
      options: [
        'The rings expand outward',
        'The rings contract inward',
        'The contrast between rings increases',
        'The rings disappear completely'
      ],
      correctAnswer: 1,
      explanation: 'When the air gap is filled with a liquid with refractive index greater than air, the optical path difference changes, causing the rings to contract inward.'
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
            <h1 className="text-2xl font-bold">Physics Lab: Newton's Rings</h1>
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
                  <h2 className="text-xl font-semibold mb-4">Newton's Rings Simulation</h2>
                  <SimulationController 
                    type="physics" 
                    simulationType="newtonRings"
                    title="Newton's Rings Experiment" 
                    description="Observe interference patterns formed between a curved lens and a flat surface"
                  />
                </div>
              </TabsContent>
              
              {/* Theory Tab */}
              <TabsContent value="theory" className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Newton's Rings Theory</h2>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      Newton's rings are an interference pattern caused by the reflection of light between a spherical surface and an adjacent flat surface. When light falls on this setup, some of it reflects from the upper surface of the air gap, while some passes through and reflects from the lower surface.
                    </p>
                    
                    <h3 className="text-lg font-medium mt-4">Key Principles</h3>
                    <div className="bg-muted rounded-lg p-4 my-4 overflow-x-auto">
                      <p><strong>Interference condition:</strong></p>
                      <p>For constructive interference: 2d = mλ</p>
                      <p>For destructive interference: 2d = (m+1/2)λ</p>
                      <p className="mt-2">Where:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>d is the thickness of the air gap</li>
                        <li>λ is the wavelength of light</li>
                        <li>m is an integer (0, 1, 2, ...)</li>
                      </ul>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-4">Air Gap Thickness</h3>
                    <p>
                      The thickness of the air gap at a distance r from the center is approximately:
                    </p>
                    <div className="bg-muted rounded-lg p-4 my-4 text-center">
                      d = r²/2R
                    </div>
                    <p>
                      Where R is the radius of curvature of the lens. This means that the rings form where the air gap has the right thickness for constructive or destructive interference.
                    </p>
                    
                    <h3 className="text-lg font-medium mt-4">Applications</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li><strong>Optical Testing:</strong> Used to test the quality of optical surfaces</li>
                      <li><strong>Measuring Wavelength:</strong> Can be used to determine the wavelength of light</li>
                      <li><strong>Thin Film Thickness:</strong> Used to measure thickness of very thin films</li>
                      <li><strong>Lens Quality:</strong> Used to check for defects in lenses</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              {/* Quiz Tab */}
              <TabsContent value="quiz" className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  {!quizStarted ? (
                    <div className="text-center py-8">
                      <CircleDot className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h2 className="text-xl font-semibold mb-2">Newton's Rings Quiz</h2>
                      <p className="mb-6 text-muted-foreground">
                        Test your understanding of Newton's Rings and wave interference with this short quiz.
                      </p>
                      <Button onClick={() => setQuizStarted(true)}>
                        Start Quiz
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Newton's Rings Quiz</h2>
                        <div className="text-sm">
                          Score: {quizResults.correct}/{quizResults.total}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {newtonRingsQuestions.map((question) => (
                          <QuizCard
                            key={question.id}
                            question={question}
                            onAnswer={handleQuizAnswer}
                          />
                        ))}
                      </div>
                      
                      {quizResults.answered.length === newtonRingsQuestions.length && (
                        <div className="mt-8 p-6 bg-muted rounded-lg text-center">
                          <h3 className="text-lg font-semibold mb-2">
                            Quiz Completed!
                          </h3>
                          <p className="mb-4">
                            You scored {quizResults.correct} out of {newtonRingsQuestions.length} questions correctly.
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
              <AiChatbox context="Newton's Rings Experiment" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewtonRingsLab;
