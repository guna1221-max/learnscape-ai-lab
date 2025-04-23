
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';

// Define the message types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AiChatboxProps {
  context?: string; // Optional context about the current experiment
}

export function AiChatbox({ context }: AiChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi there! I\'m your AI tutor. How can I help you understand this experiment better?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple rule-based responses for the AI Tutor
  const generateResponse = (userMessage: string): string => {
    const lowercasedMessage = userMessage.toLowerCase();
    
    // Physics responses
    if (lowercasedMessage.includes('force') || lowercasedMessage.includes('newton')) {
      return "In physics, force is any interaction that, when unopposed, will change the motion of an object. Force can cause an object with mass to change its velocity, i.e., to accelerate. Newton's second law states that Force = Mass × Acceleration.";
    } 
    
    if (lowercasedMessage.includes('velocity') || lowercasedMessage.includes('speed')) {
      return "Velocity is a vector quantity that describes the rate at which an object changes position. It includes both speed and direction. The formula is velocity = displacement ÷ time.";
    }
    
    // Biology responses
    if (lowercasedMessage.includes('cell') || lowercasedMessage.includes('membrane')) {
      return "Cells are the basic structural and functional units of all living organisms. The cell membrane is a biological membrane that separates the interior of a cell from the outside environment and controls what moves in and out of the cell.";
    }
    
    if (lowercasedMessage.includes('dna') || lowercasedMessage.includes('gene')) {
      return "DNA (deoxyribonucleic acid) is a molecule composed of two polynucleotide chains that coil around each other to form a double helix. It carries genetic instructions for the development, functioning, growth, and reproduction of all known organisms.";
    }
    
    // Questions about the AI itself
    if (lowercasedMessage.includes('who are you') || lowercasedMessage.includes('what are you')) {
      return "I'm an AI tutor designed to help you understand science concepts and experiments. I can answer questions about physics, biology, and help you interpret experiment results.";
    }
    
    // Help or unclear questions
    if (lowercasedMessage.includes('help') || lowercasedMessage.includes('explain')) {
      return "I'd be happy to help! Could you specify which concept or part of the experiment you'd like me to explain in more detail?";
    }
    
    // Default response for unrecognized queries
    return "That's an interesting question! While I'm still learning, I'll do my best to help. Could you rephrase or ask something about the specific experiment you're working on?";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response delay (would be replaced with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(userMessage.content),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-card">
      <div className="bg-muted px-4 py-2 border-b">
        <h3 className="font-medium">AI Tutor Assistant</h3>
        <p className="text-xs text-muted-foreground">
          Ask questions about your experiment or science concepts
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className={`h-8 w-8 ${message.role === 'assistant' ? 'bg-primary' : 'bg-secondary'}`}>
                <span className="text-xs">
                  {message.role === 'assistant' ? 'AI' : 'You'}
                </span>
              </Avatar>
              <div className={`rounded-lg px-4 py-2 ${
                message.role === 'assistant' 
                  ? 'bg-muted text-foreground' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8 bg-primary">
                <span className="text-xs">AI</span>
              </Avatar>
              <div className="rounded-lg px-4 py-3 bg-muted text-foreground">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
