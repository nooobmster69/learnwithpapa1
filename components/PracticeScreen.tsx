
import React, { useState, useEffect, useRef, useCallback } from 'react';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

const NextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
);

const CheckmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
)

interface PracticeScreenProps {
  items: string[];
  title: string;
  onBack: () => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({ items, title, onBack }) => {
  const [speed, setSpeed] = useState(3); // in seconds
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [progressBarKey, setProgressBarKey] = useState(0);
  
  const timerRef = useRef<number | null>(null);

  const goToNextItem = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setAnimationClass('animate-fade-out');
    
    // Wait for fade-out animation to complete before changing the content
    setTimeout(() => {
        setCurrentIndex(prevIndex => {
            if (prevIndex < items.length - 1) {
                setAnimationClass('animate-bounce-in');
                setProgressBarKey(k => k + 1);
                return prevIndex + 1;
            }
            
            setIsFinished(true);
            return prevIndex;
        });
    }, 500); 
  }, [items.length]);

  useEffect(() => {
    // Set a new timer whenever the current item changes
    if (isStarted && !isFinished) {
      timerRef.current = window.setTimeout(goToNextItem, speed * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isStarted, isFinished, speed, currentIndex, goToNextItem]);
  
  const startPractice = () => {
    if (items.length > 0) {
      setCurrentIndex(0);
      setIsFinished(false);
      setAnimationClass('animate-bounce-in');
      setProgressBarKey(1);
      setIsStarted(true);
    }
  };

  const handleBack = () => {
     if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      onBack();
  };
  
  const handleManualNext = () => {
      goToNextItem();
  };

  if (!isStarted) {
    return (
      <div className="w-11/12 sm:w-full max-w-2xl mx-auto p-6 md:p-8 bg-white rounded-3xl shadow-2xl text-center relative border-4 border-brand-accent">
        <button onClick={onBack} className="absolute top-4 left-4 p-2 text-gray-600 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition">
            <BackIcon />
        </button>
        <h1 className="text-4xl md:text-5xl font-content font-bold text-brand-text mb-6">អនុវត្តន៍ {title}</h1>
        <div className="my-12">
            <label htmlFor="speed-slider" className="block text-xl md:text-2xl text-gray-600 mb-4 font-content">
                ល្បឿនពាក្យ: <span className="font-content font-bold text-brand-accent text-2xl md:text-3xl">{speed}</span> វិនាទី
            </label>
            <div className="flex items-center space-x-4">
                <span className="text-xl font-bold">យឺត</span>
                <input
                    id="speed-slider"
                    type="range"
                    min="2"
                    max="20"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                    className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
                <span className="text-xl font-bold">លឿន</span>
            </div>
        </div>
        <button
          onClick={startPractice}
          disabled={items.length === 0}
          className="w-full px-8 py-4 text-2xl md:text-3xl font-content font-bold text-white bg-brand-primary rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-not-allowed border-b-8 border-green-600 active:border-b-2"
        >
          {items.length > 0 ? 'ចាប់ផ្តើម!' : 'គ្មានអ្វីសម្រាប់អនុវត្តន៍'}
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="w-full h-screen fixed inset-0 flex flex-col items-center justify-center bg-brand-bg p-4 space-y-8">
        <div className="text-center animate-bounce-in space-y-4">
            <CheckmarkIcon />
            <h2 className="text-5xl font-bold font-content text-brand-text">អានចប់ហើយ! ពូកែណាស់!</h2>
        </div>
        <button
          onClick={handleBack}
          className="px-16 py-6 text-3xl font-content font-bold text-white bg-brand-secondary rounded-full shadow-lg transform hover:scale-110 hover:rotate-3 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 border-b-8 border-blue-600 active:border-b-2"
        >
          ត្រលប់ក្រោយ
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen fixed inset-0 flex flex-col items-center justify-between bg-brand-bg p-4 md:py-8">
        <div className="w-full flex justify-start p-2 z-20">
            <button onClick={handleBack} className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 transition z-10 hover:scale-110">
                <BackIcon />
            </button>
        </div>
        
        <div className="flex-grow flex items-center justify-center w-full relative">
            <div
                key={currentIndex}
                className={`text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-content font-bold text-brand-text ${animationClass}`}
                 style={{ textShadow: '8px 8px 0px rgba(0,0,0,0.1)' }}
            >
                {items[currentIndex]}
            </div>

            <button 
                onClick={handleManualNext}
                className="absolute right-0 md:right-4 lg:right-8 p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-transform hover:scale-110 active:scale-95 z-20"
                aria-label="Next Word"
            >
                <NextIcon />
            </button>
        </div>
        
        <div className="w-full max-w-6xl mx-auto p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg mb-4">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 text-center">
                {items.map((item, index) => {
                    const isDone = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    return (
                        <div 
                            key={index} 
                            className={`p-2 rounded-lg text-lg md:text-xl font-bold font-content transition-all duration-300 shadow-sm
                                ${isCurrent ? 'bg-yellow-300 scale-110 ring-4 ring-yellow-400 z-10' : ''} 
                                ${isDone ? 'bg-gray-200 text-gray-500' : 'bg-white'}
                            `}
                        >
                            {item}
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="w-11/12 md:w-2/3 lg:w-1/2 mb-4">
            <div className="h-6 bg-white/50 rounded-full overflow-hidden border-2 border-white/80 shadow-inner">
                <div
                    key={progressBarKey}
                    className="h-full bg-brand-primary rounded-full"
                    style={{
                        animation: `shrink-width ${speed}s linear forwards`,
                    }}
                />
            </div>
        </div>
    </div>
  );
};

export default PracticeScreen;
