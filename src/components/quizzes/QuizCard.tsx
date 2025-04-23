
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    setIsSubmitted(true);
    onAnswer(isCorrect, question.id);
  };
  
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-lg font-medium mb-4">{question.text}</h3>
      
      <RadioGroup
        value={selectedAnswer?.toString()}
        onValueChange={(value) => !isSubmitted && setSelectedAnswer(parseInt(value))}
        className="space-y-3"
        disabled={isSubmitted}
      >
        {question.options.map((option, index) => (
          <div key={index} className="flex items-start space-x-2">
            <RadioGroupItem value={index.toString()} id={`option-${question.id}-${index}`} />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor={`option-${question.id}-${index}`}
                className={`text-sm font-medium ${
                  isSubmitted && index === question.correctAnswer ? 'text-green-600 dark:text-green-400' : ''
                } ${
                  isSubmitted && selectedAnswer === index && !isCorrect ? 'text-red-600 dark:text-red-400' : ''
                }`}
              >
                {option}
                {isSubmitted && index === question.correctAnswer && (
                  <CheckCircle className="inline ml-2 h-4 w-4 text-green-600 dark:text-green-400" />
                )}
                {isSubmitted && selectedAnswer === index && !isCorrect && (
                  <XCircle className="inline ml-2 h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </Label>
            </div>
          </div>
        ))}
      </RadioGroup>
      
      {isSubmitted && (
        <div className={`mt-4 p-3 rounded text-sm ${
          isCorrect ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                    'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100'
        }`}>
          <p className="font-medium mb-1">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
          <p>{question.explanation}</p>
        </div>
      )}
      
      {!isSubmitted && (
        <Button 
          onClick={handleSubmit} 
          className="mt-4"
          disabled={selectedAnswer === null}
        >
          Submit Answer
        </Button>
      )}
    </div>
  );
}
