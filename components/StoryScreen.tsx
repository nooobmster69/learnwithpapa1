
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Story } from '../types';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
);

const CheckmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
)

interface StoryScreenProps {
  story: Story;
  onBack: () => void;
}

const StoryScreen: React.FC<StoryScreenProps> = ({ story, onBack }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [speed, setSpeed] = useState(5); // Default 5 seconds per line
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  
  const timerRef = useRef<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const lines = story.content;

  const handleBack = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onBack();
  }, [onBack]);
  
  useEffect(() => {
    if (isStarted && currentLineIndex < lines.length) {
      timerRef.current = window.setInterval(() => {
        setCurrentLineIndex(prev => prev + 1);
        setProgressKey(k => k + 1);
      }, speed * 1000);
    } else if (currentLineIndex >= lines.length) {
       if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, speed, lines.length, currentLineIndex]);
  
  useEffect(() => {
      if(sidebarRef.current) {
          const activeElement = sidebarRef.current.querySelector('.bg-yellow-200');
          if (activeElement) {
              activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
      }
  }, [currentLineIndex]);


  const handleStart = () => {
    if (lines.length > 0) {
      setCurrentLineIndex(0);
      setIsStarted(true);
      setProgressKey(k => k + 1);
    }
  };

  if (!isStarted) {
    return (
      <div className="w-11/12 sm:w-full max-w-2xl mx-auto p-6 md:p-8 bg-white/90 rounded-3xl shadow-2xl text-center relative border-4 border-brand-accent">
        <button onClick={onBack} className="absolute top-4 left-4 p-2 text-gray-600 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition">
            <BackIcon />
        </button>
        <h1 className="text-3xl md:text-4xl font-content font-bold text-brand-text mb-2">{story.title}</h1>
        <h2 className="text-xl md:text-2xl font-content text-gray-500 mb-8">ការអានអត្ថបទខ្លី</h2>
        
        <div className="my-12">
            <label htmlFor="speed-slider" className="block text-xl md:text-2xl text-gray-600 mb-4 font-content">
                ល្បឿន: <span className="font-content font-bold text-brand-accent text-2xl md:text-3xl">{speed}</span> វិនាទីក្នុងមួយជួរ
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
                    className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
                <span className="text-xl font-bold">លឿន</span>
            </div>
        </div>
        
        <button
          onClick={handleStart}
          disabled={lines.length === 0}
          className="w-full flex items-center justify-center px-8 py-4 text-2xl md:text-3xl font-content font-bold text-white bg-brand-primary rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-not-allowed border-b-8 border-green-600 active:border-b-2"
        >
          <PlayIcon />
          {lines.length > 0 ? 'ចាប់ផ្តើមអាន!' : 'គ្មានអត្ថបទ'}
        </button>
      </div>
    );
  }

  const finishedReading = currentLineIndex >= lines.length;

  return (
    <div className="w-full h-screen fixed inset-0 flex flex-col items-center bg-brand-bg p-4 overflow-hidden">
      <div className="w-full flex items-center justify-between px-6 pt-6 absolute top-0 left-0 z-10">
        <button onClick={handleBack} className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 transition hover:scale-110">
          <BackIcon />
        </button>
      </div>
      
      <div className="w-full h-full flex flex-col md:flex-row items-stretch justify-center gap-8 pt-24 pb-32">
        {/* Main reading view */}
        <main className="flex-grow flex items-center justify-center p-4">
          {finishedReading ? (
             <div className="text-center animate-bounce-in space-y-4">
                <CheckmarkIcon />
                <h2 className="text-5xl font-bold font-content text-brand-text">អានចប់ហើយ! ពូកែណាស់!</h2>
             </div>
          ) : (
            <p
                key={currentLineIndex}
                className="font-content text-5xl md:text-7xl text-center font-bold text-brand-text leading-relaxed animate-pop-in"
                style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)'}}
            >
                {lines[currentLineIndex]}
            </p>
          )}
        </main>

        {/* Sidebar with all lines */}
        <aside ref={sidebarRef} className="w-full md:w-1/3 md:max-w-md h-full bg-white/60 rounded-2xl p-4 shadow-lg border-2 border-white/80 overflow-y-auto flex-shrink-0">
          <h3 className="font-content text-2xl font-bold text-brand-text text-center mb-4 sticky top-0 bg-white/80 py-2 rounded-xl z-10">
            តារាងអត្ថបទខ្លី
          </h3>
          <div className="space-y-3">
            {lines.map((line, index) => {
              const isRead = index < currentLineIndex;
              const isCurrent = index === currentLineIndex;
              
              return (
                <p
                  key={index}
                  className={`
                    p-3 rounded-lg transition-all duration-300 font-content text-xl
                    ${isCurrent ? 'bg-yellow-300 text-brand-text font-bold scale-105 shadow-md' : ''}
                    ${isRead ? 'text-gray-400 opacity-80' : 'text-gray-800 bg-white/50'}
                  `}
                >
                  {line}
                </p>
              )
            })}
          </div>
        </aside>
      </div>
      
      <div className="w-11/12 md:w-2/3 lg:w-1/2 absolute bottom-12">
        <div className="h-6 bg-white/50 rounded-full overflow-hidden border-2 border-white/80 shadow-inner">
          <div
            key={progressKey}
            className="h-full bg-brand-primary rounded-full"
            style={ !finishedReading ? { animation: `shrink-width ${speed}s linear forwards` } : { width: '100%', backgroundColor: '#fde047' } }
          />
        </div>
        <p className="text-center text-xl font-content font-bold text-gray-600 mt-2">
            បន្ទាត់: {finishedReading ? lines.length : currentLineIndex + 1} / {lines.length}
        </p>
      </div>
    </div>
  );
};

export default StoryScreen;