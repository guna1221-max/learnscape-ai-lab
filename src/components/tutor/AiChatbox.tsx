
import { useState, useEffect, useRef } from 'react';
import { Send, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { generateResponse } from '@/utils/tutorEngine/responseGenerator';

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
      content: 'Hi there! I\'m your AI tutor. How can I help you understand your experiment better?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingContent, setTypingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingContent]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    
    // Process the message with our NLP system (with simulated delay for UX)
    setTimeout(() => {
      const aiResponse = generateResponse(userMessage.content, context);
      simulateTyping(aiResponse);
    }, 500);
  };
  
  // Simulate typing effect for more natural interaction
  const simulateTyping = (content: string) => {
    setTypingContent('');
    
    const words = content.split(' ');
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < words.length) {
        setTypingContent(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Add the complete message to chat history
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setTypingContent('');
        setIsLoading(false);
      }
    }, 30); // typing speed - adjust as needed
  };

  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-card shadow-md">
      <div className="bg-muted px-4 py-2 border-b">
        <h3 className="font-medium flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          AI Tutor Assistant
        </h3>
        <p className="text-xs text-muted-foreground">
          Ask questions about your experiment or science concepts
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
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
                <div className="text-sm whitespace-pre-line">{message.content}</div>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {typingContent && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8 bg-primary">
                <span className="text-xs">AI</span>
              </Avatar>
              <div className="rounded-lg px-4 py-2 bg-muted text-foreground">
                <div className="text-sm whitespace-pre-line">{typingContent}</div>
                <div className="text-xs opacity-70 mt-1 animate-pulse">
                  Typing...
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && !typingContent && (
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
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Ask a question about your experiment..."
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
