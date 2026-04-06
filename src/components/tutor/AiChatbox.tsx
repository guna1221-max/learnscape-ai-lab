
import { useState, useEffect, useRef } from 'react';
import { Send, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AiChatboxProps {
  context?: string;
}

export function AiChatbox({ context }: AiChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm your AI tutor powered by real AI. Ask me anything about your Physics, EEE experiments, or algorithms!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Build API messages (skip initial greeting)
    const apiMessages = updatedMessages
      .filter((m) => m.id !== '1')
      .map((m) => ({ role: m.role, content: m.content }));

    if (context) {
      apiMessages.unshift({ role: 'user', content: `Context: ${context}` });
    }

    let assistantContent = '';
    const assistantId = (Date.now() + 1).toString();

    try {
      abortRef.current = new AbortController();
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && last.id === assistantId) {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [
                  ...prev,
                  { id: assistantId, role: 'assistant', content: assistantContent, timestamp: new Date() },
                ];
              });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast.error(err.message || 'Failed to get AI response');
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: "Sorry, I couldn't process your request. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-card shadow-md">
      <div className="bg-muted px-4 py-2 border-b">
        <h3 className="font-medium flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          AI Tutor Assistant
        </h3>
        <p className="text-xs text-muted-foreground">
          Powered by AI — ask anything about your experiments or concepts
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
                <span className="text-xs">{message.role === 'assistant' ? 'AI' : 'You'}</span>
              </Avatar>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === 'assistant'
                    ? 'bg-muted text-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8 bg-primary">
                <span className="text-xs">AI</span>
              </Avatar>
              <div className="rounded-lg px-4 py-3 bg-muted text-foreground">
                <div className="flex space-x-2 items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
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
            placeholder="Ask about experiments, formulas, concepts..."
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
