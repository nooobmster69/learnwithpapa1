import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Lesson } from '../types';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
);

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
);

interface AIStoryScreenProps {
  lesson: Lesson;
  onBack: () => void;
}

const AIStoryScreen: React.FC<AIStoryScreenProps> = ({ lesson, onBack }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isStarted, setIsStarted] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  const timerRef = useRef<number | null>(null);

  const generateStory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setLines([]);
    setIsStarted(false);
    setCurrentLineIndex(0);
    if (timerRef.current) clearInterval(timerRef.current);

    if (!process.env.API_KEY) {
      setError("API key is not configured. This feature is unavailable.");
      setIsLoading(false);
      return;
    }

    const canGenerateStory = lesson.syllables?.length > 0 || lesson.words?.length > 0 || lesson.story?.content?.length > 0;
    
    if (!canGenerateStory) {
      setError("This lesson has no content to create a story from.");
      setIsLoading(false);
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const promptParts = [];
    if (lesson.syllables?.length > 0) {
        promptParts.push(`- Syllables to use: ${lesson.syllables.join(', ')}`);
    }
    if (lesson.words?.length > 0) {
        promptParts.push(`- Words to use: ${lesson.words.join(', ')}`);
    }
    if (lesson.story?.content?.length > 0) {
        promptParts.push(`- Example story for inspiration: "${lesson.story.content.join(' ')}"`);
    }
    
    const prompt = `
Please write a very short, new, and happy story (2-4 simple sentences) for a child learning Khmer.
Each sentence must be on a new line.

**Instructions:**
1.  The story must be simple and easy to read.
2.  You MUST primarily use vocabulary from the provided materials.
3.  Do not use words that are not in the lists if possible.

**Provided Vocabulary:**
${promptParts.join('\n')}

Generate the new story now.
    `;
    
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              systemInstruction: "You are a storyteller for kids under 5 years old learning to read Khmer. You write very simple, happy, and short stories based ONLY on the provided vocabulary.",
              temperature: 0.8,
          }
      });
      const storyLines = response.text.split('\n').filter(line => line.trim() !== '');
      if (storyLines.length === 0) {
        throw new Error("The AI returned an empty story. Please try again.");
      }
      setLines(storyLines);
    } catch (e) {
      console.error("Gemini API error:", e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`The AI couldn't think of a story right now. Please try again. (${errorMessage})`);
    } finally {
      setIsLoading(false);
    }
  }, [lesson]);

  useEffect(() => {
    generateStory();
  }, [generateStory]);

  const { wordsPerLine, totalWords } = useMemo(() => {
    const wordsPerLine = lines.map(line => line.split(/\s+/).filter(Boolean).length);
    const totalWords = wordsPerLine.reduce((sum, count) => sum + count, 0);
    return { wordsPerLine, totalWords };
  }, [lines]);

  const wordsRead = useMemo(() => {
    if (currentLineIndex >= lines.length) return totalWords;
    return wordsPerLine.slice(0, currentLineIndex + 1).reduce((sum, count) => sum + count, 0);
  }, [wordsPerLine, totalWords, currentLineIndex, lines]);

  useEffect(() => {
    if (!isStarted || currentLineIndex >= lines.length - 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const showNextLine = () => {
      setAnimationClass('animate-fade-out');
      setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setAnimationClass('animate-pop-in');
        setProgressKey(k => k + 1);
      }, 500);
    };

    timerRef.current = window.setInterval(showNextLine, speed * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, speed, lines, currentLineIndex]);


  const handleStartReading = () => {
    if (lines.length > 0) {
      setCurrentLineIndex(0);
      setIsStarted(true);
      setAnimationClass('animate-pop-in');
      setProgressKey(k => k + 1);
    }
  };

  const handleBack = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onBack();
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen fixed inset-0 flex flex-col items-center justify-center bg-brand-bg p-4">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <LoadingSpinner />
            <h1 className="text-4xl font-content font-bold text-purple-600">AI is writing a story...</h1>
            <p className="text-xl font-content text-gray-500">Please wait a moment!</p>
        </div>
      </div>
    );
  }

  if (error) {
      return (
          <div className="w-full h-screen fixed inset-0 flex flex-col items-center justify-center bg-brand-bg p-4">
            <button onClick={handleBack} className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 transition z-10 hover:scale-110">
                <BackIcon />
            </button>
            <div className="w-11/12 sm:w-full max-w-2xl mx-auto p-6 md:p-8 bg-white/90 rounded-3xl shadow-2xl text-center relative border-4 border-red-400">
                <h1 className="text-3xl md:text-4xl font-content font-bold text-red-600 mb-4">Oh no!</h1>
                <p className="text-xl text-brand-text font-content mb-8">{error}</p>
                <button
                    onClick={generateStory}
                    className="w-full flex items-center justify-center px-8 py-4 text-2xl md:text-3xl font-content font-bold text-brand-primary rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 border-b-8 border-green-600 active:border-b-2"
                >
                    <RefreshIcon />
                    Try Again
                </button>
            </div>
          </div>
      );
  }

  if (isStarted) {
    return (
        <div className="w-full h-screen fixed inset-0 flex flex-col items-center justify-center bg-brand-bg p-4">
          <button onClick={handleBack} className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 transition z-10 hover:scale-110">
            <BackIcon />
          </button>
    
          <div className="flex-grow flex items-center justify-center w-full">
            <div
              key={currentLineIndex}
              className={`text-4xl md:text-5xl lg:text-6xl font-content font-bold text-brand-text text-center leading-relaxed max-w-5xl ${animationClass}`}
              style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.05)' }}
            >
              {lines[currentLineIndex]}
            </div>
          </div>
    
          <div className="w-11/12 md:w-2/3 lg:w-1/2 absolute bottom-12">
            <div className="h-6 bg-white/50 rounded-full overflow-hidden border-2 border-white/80 shadow-inner">
              <div
                key={progressKey}
                className="h-full bg-purple-500 rounded-full"
                style={ currentLineIndex < lines.length - 1 ? { animation: `shrink-width ${speed}s linear forwards` } : { width: '100%', background: '#fde047' } }
              />
            </div>
            <p className="text-center text-xl font-content font-bold text-gray-600 mt-2">
                ពាក្យ: {wordsRead} / {totalWords}
            </p>
          </div>
        </div>
      );
  }
  
  return (
    <div className="w-full h-screen fixed inset-0 flex flex-col items-center justify-center bg-brand-bg p-4">
        <div className="w-11/12 sm:w-full max-w-2xl mx-auto p-6 md:p-8 bg-white/90 rounded-3xl shadow-2xl text-center relative border-4 border-purple-500">
            <button onClick={handleBack} className="absolute top-4 left-4 p-2 text-gray-600 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition">
                <BackIcon />
            </button>
            <h1 className="text-3xl md:text-4xl font-content font-bold text-brand-text mb-2">AI Story Time</h1>
            <h2 className="text-xl md:text-2xl font-content text-gray-500 mb-8">រឿងថ្មីសម្រាប់អ្នក!</h2>
            
            <div className="my-8">
                <label htmlFor="speed-slider" className="block text-xl md:text-2xl text-gray-600 mb-4 font-content">
                    ល្បឿន: <span className="font-content font-bold text-purple-600 text-2xl md:text-3xl">{speed}</span> វិនាទីក្នុងមួយជួរ
                </label>
                <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold">យឺត</span>
                    <input
                        id="speed-slider"
                        type="range"
                        min="2"
                        max="30"
                        value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                        className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <span className="text-xl font-bold">លឿន</span>
                </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleStartReading}
                disabled={lines.length === 0}
                className="w-full flex items-center justify-center px-8 py-4 text-2xl md:text-3xl font-content font-bold text-white bg-purple-500 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:bg-gray-400 disabled:cursor-not-allowed border-b-8 border-purple-700 active:border-b-2"
              >
                <PlayIcon />
                {lines.length > 0 ? 'ចាប់ផ្តើមអាន!' : 'គ្មានអត្ថបទ'}
              </button>
              <button
                onClick={generateStory}
                className="w-full flex items-center justify-center px-8 py-4 text-xl md:text-2xl font-content font-bold text-white bg-brand-secondary rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 border-b-8 border-blue-700 active:border-b-2"
              >
                  <RefreshIcon />
                  Generate New Story
              </button>
            </div>
        </div>
    </div>
  );
};

export default AIStoryScreen;