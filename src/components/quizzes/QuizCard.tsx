
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean, questionId: string) => void;
}

export function QuizCard({ question, onAnswer }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === question.correctAnswer;
    onAnswer(isCorrect, question.id);
    setShowExplanation(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === null ? "outline" : 
                selectedAnswer === index ? 
                  (index === question.correctAnswer ? "default" : "destructive") :
                  index === question.correctAnswer ? "default" : "outline"
              }
              className="justify-start h-auto py-4 px-6"
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <div className="flex items-center gap-2">
                {selectedAnswer !== null && index === question.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {selectedAnswer === index && index !== question.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>{option}</span>
              </div>
            </Button>
          ))}
        </div>
        
        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
