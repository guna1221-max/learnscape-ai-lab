
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AiChatbox } from '@/components/tutor/AiChatbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Microscope, FlaskConical, GraduationCap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TutorPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const topics = [
    {
      id: 'physics',
      title: 'Physics',
      description: 'Get help with mechanics, waves, thermodynamics, and more',
      icon: FlaskConical,
      subtopics: ['Mechanics', 'Waves', 'Thermodynamics', 'Electricity']
    },
    {
      id: 'biology',
      title: 'Biology',
      description: 'Explore cell biology, genetics, ecology, and physiology',
      icon: Microscope,
      subtopics: ['Cell Biology', 'Genetics', 'Ecology', 'Physiology']
    }
  ];
  
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
            <h1 className="text-2xl font-bold">AI Tutor Assistant</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topic Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Topics
                </CardTitle>
                <CardDescription>
                  Select a topic to get focused help from the AI tutor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topics.map((topic) => (
                  <div 
                    key={topic.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedTopic === topic.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    <div className="flex items-center gap-3">
                      <topic.icon className="h-5 w-5" />
                      <div>
                        <h3 className="font-medium">{topic.title}</h3>
                        <p className={`text-xs ${selectedTopic === topic.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {selectedTopic && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {topics.find(t => t.id === selectedTopic)?.title} Subtopics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {topics.find(t => t.id === selectedTopic)?.subtopics.map((subtopic) => (
                      <Button 
                        key={subtopic} 
                        variant="outline"
                        className="justify-start text-sm"
                        onClick={() => {}}
                      >
                        {subtopic}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  Study Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Physics Lecture Notes
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Biology Reference Guide
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Formula Sheets
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Experiment Procedures
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* AI Tutor Chat */}
          <div className="lg:col-span-2 h-[700px]">
            <AiChatbox 
              context={selectedTopic ? `The user is studying ${selectedTopic}` : undefined} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TutorPage;
