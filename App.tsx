import React, { useState, useCallback, useEffect } from 'react';
import { Lesson, View, ActivityType, LessonData } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import LessonSelectionScreen from './components/LessonSelectionScreen';
import ActivitySelectionScreen from './components/ActivitySelectionScreen';
import PracticeScreen from './components/PracticeScreen';
import StoryScreen from './components/StoryScreen';
import AIStoryScreen from './components/AIStoryScreen';
import WordScrambleGame from './components/WordScrambleGame';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z"/>
    <path d="M12 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" opacity=".3"/>
  </svg>
);


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Welcome);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        const response = await fetch('./data/lessons.json');
        if (!response.ok) {
          throw new Error(`Failed to load lessons data. Status: ${response.status}`);
        }
        const data: LessonData = await response.json();
        setLessons(data.lessons);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while fetching lessons.';
        setError(errorMessage);
        console.error("Failed to fetch lessons:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleStart = useCallback(() => {
    if(!isLoading && !error) {
      setCurrentView(View.LessonSelection);
    }
  }, [isLoading, error]);

  const handleSelectLesson = useCallback((lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView(View.ActivitySelection);
  }, []);

  const handleSelectActivity = useCallback((activity: ActivityType) => {
    setSelectedActivity(activity);
    setCurrentView(View.Practice);
  }, []);

  const handleSelectStory = useCallback(() => {
    setCurrentView(View.Story);
  }, []);
  
  const handleSelectAIStory = useCallback(() => {
    setCurrentView(View.AIStory);
  }, []);

  const handleSelectWordScramble = useCallback(() => {
    setSelectedActivity(ActivityType.WordScramble);
    setCurrentView(View.WordScrambleGame);
  }, []);

  const handleBackToLessonSelection = useCallback(() => {
    setSelectedLesson(null);
    setCurrentView(View.LessonSelection);
  }, []);

  const handleBackToActivitySelection = useCallback(() => {
    setSelectedActivity(null);
    setCurrentView(View.ActivitySelection);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center flex flex-col items-center justify-center space-y-4">
          <div className="animate-pulse"><SunIcon /></div>
          <h1 className="text-4xl font-content font-bold">Loading Fun Lessons...</h1>
        </div>
      );
    }
    if (error) {
       return (
        <div className="text-center p-8 bg-white/80 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-content font-bold text-red-500">Oh no! Something went wrong.</h1>
          <p className="font-content mt-4 text-lg">{error}</p>
        </div>
       );
    }

    switch (currentView) {
      case View.Welcome:
        return <WelcomeScreen onStart={handleStart} />;
      case View.LessonSelection:
        return <LessonSelectionScreen lessons={lessons} onSelectLesson={handleSelectLesson} />;
      case View.ActivitySelection:
        if (!selectedLesson) return null; // Should not happen in normal flow
        return (
          <ActivitySelectionScreen
            lesson={selectedLesson}
            onSelectSyllables={() => handleSelectActivity(ActivityType.Syllables)}
            onSelectWords={() => handleSelectActivity(ActivityType.Words)}
            onSelectStory={handleSelectStory}
            onSelectAIStory={handleSelectAIStory}
            onSelectWordScramble={handleSelectWordScramble}
            onBack={handleBackToLessonSelection}
          />
        );
      case View.Practice:
        if (!selectedLesson || !selectedActivity) return null; // Should not happen
        const items = selectedActivity === ActivityType.Words ? selectedLesson.words : selectedLesson.syllables;
        const title = selectedActivity === ActivityType.Words ? 'ការអានពាក្យ' : 'ការអានព្យាង្គ';
        return <PracticeScreen items={items} title={title} onBack={handleBackToActivitySelection} />;
      case View.Story:
        if (!selectedLesson) return null; // Should not happen
        return <StoryScreen story={selectedLesson.story} onBack={handleBackToActivitySelection} />;
      case View.AIStory:
        if (!selectedLesson) return null; // Should not happen
        return <AIStoryScreen lesson={selectedLesson} onBack={handleBackToActivitySelection} />;
      case View.WordScrambleGame:
        if (!selectedLesson) return null;
        return <WordScrambleGame lesson={selectedLesson} onBack={handleBackToActivitySelection} />;
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-content">
      <div className="w-full max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
