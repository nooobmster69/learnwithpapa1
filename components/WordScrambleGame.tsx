
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Lesson } from '../types';

// --- ICONS ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const CheckmarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>;

// --- TYPES ---
type WordItem = { word: string; id: string };

// --- HELPER FUNCTIONS ---
const shuffleArray = (array: WordItem[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- MAIN COMPONENT ---
interface WordScrambleGameProps {
  lesson: Lesson;
  onBack: () => void;
}

const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ lesson, onBack }) => {
  const sentences = useMemo(() => lesson.story.content.filter(s => s.trim().length > 0 && s.split(' ').length > 1), [lesson.story.content]);

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'correct' | 'incorrect' | 'finished'>('intro');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [wordBank, setWordBank] = useState<WordItem[]>([]);
  const [dropZone, setDropZone] = useState<WordItem[]>([]);
  const [score, setScore] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [isOverZone, setIsOverZone] = useState(false);

  const setupSentence = useCallback((index: number) => {
    if (index >= sentences.length) {
      setGameState('finished');
      return;
    }
    const currentSentence = sentences[index];
    const words = currentSentence.split(' ').map((word, i) => ({ word, id: `${index}-${i}` }));
    
    let shuffled;
    do {
      shuffled = shuffleArray(words);
    } while (shuffled.map(item => item.word).join(' ') === words.map(item => item.word).join(' '));

    setWordBank(shuffled);
    setDropZone([]);
    setGameState('playing');
    setAnimationClass('');
  }, [sentences]);

  const handleStartGame = () => {
    setCurrentSentenceIndex(0);
    setScore(0);
    setupSentence(0);
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, item: WordItem, source: 'bank' | 'zone') => {
    e.dataTransfer.setData('wordItem', JSON.stringify({ ...item, source }));
    e.currentTarget.classList.add('opacity-40');
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.remove('opacity-40');
    setIsOverZone(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, target: 'bank' | 'zone') => {
    e.preventDefault();
    const data = e.dataTransfer.getData('wordItem');
    if (!data) return;
    const item: WordItem & { source: 'bank' | 'zone' } = JSON.parse(data);

    if (item.source === 'bank' && target === 'zone') {
        setDropZone(prev => [...prev, item]);
        setWordBank(prev => prev.filter(w => w.id !== item.id));
    } else if (item.source === 'zone' && target === 'bank') {
        setWordBank(prev => [...prev, item]);
        setDropZone(prev => prev.filter(w => w.id !== item.id));
    }
    setIsOverZone(false);
  };

  const handleReset = () => setupSentence(currentSentenceIndex);

  const handleNextSentence = useCallback(() => {
    const nextIndex = currentSentenceIndex + 1;
    setCurrentSentenceIndex(nextIndex);
    setupSentence(nextIndex);
  }, [currentSentenceIndex, setupSentence]);

  useEffect(() => {
    if (gameState !== 'playing' || wordBank.length > 0) return;
    
    const correctSentence = sentences[currentSentenceIndex];
    const currentAttempt = dropZone.map(w => w.word).join(' ');

    if (currentAttempt === correctSentence) {
      setGameState('correct');
      setScore(prev => prev + 1);
      setTimeout(handleNextSentence, 2000);
    } else {
      setGameState('incorrect');
      setAnimationClass('animate-wiggle');
      setTimeout(() => {
        setGameState('playing');
        setAnimationClass('');
      }, 1000);
    }
  }, [wordBank, dropZone, sentences, currentSentenceIndex, gameState, handleNextSentence]);

  if (gameState === 'intro') {
    return (
      <div className="w-11/12 sm:w-full max-w-2xl mx-auto p-6 md:p-8 bg-white/90 rounded-3xl shadow-2xl text-center relative border-4 border-orange-500">
        <button onClick={onBack} className="absolute top-4 left-4 p-2 text-gray-600 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition">
            <BackIcon />
        </button>
        <h1 className="text-4xl md:text-5xl font-content font-bold text-brand-text mb-4">ល្បែងរៀបពាក្យ</h1>
        <p className="text-xl text-gray-600 mb-8 font-content">សូមអូសពាក្យដើម្បីបង្កើតជាល្បះឱ្យបានត្រឹមត្រូវ។</p>
        <button
          onClick={handleStartGame}
          className="w-full px-8 py-4 text-2xl md:text-3xl font-content font-bold text-white bg-orange-500 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300 border-b-8 border-orange-700 active:border-b-2"
        >
          ចាប់ផ្តើមលេង!
        </button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="w-full h-screen fixed inset-0 flex flex-col items-center justify-center bg-brand-bg p-4 space-y-8">
        <div className="text-center animate-bounce-in space-y-4">
            <CheckmarkIcon />
            <h2 className="text-5xl font-bold font-content text-brand-text">លេងចប់ហើយ! ពូកែណាស់!</h2>
            <p className="text-3xl font-content text-gray-700">អ្នកបាន: <span className="font-bold text-orange-500">{score} / {sentences.length}</span> ពិន្ទុ</p>
        </div>
        <button
          onClick={onBack}
          className="px-16 py-6 text-3xl font-content font-bold text-white bg-brand-secondary rounded-full shadow-lg transform hover:scale-110 hover:rotate-3 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 border-b-8 border-blue-600 active:border-b-2"
        >
          ត្រលប់ក្រោយ
        </button>
      </div>
    );
  }

  const progressPercentage = (currentSentenceIndex / sentences.length) * 100;
  let boxBorderColor = 'border-gray-300';
  if (gameState === 'correct') boxBorderColor = 'border-green-500';
  if (gameState === 'incorrect') boxBorderColor = 'border-red-500';

  return (
    <div className="w-full h-screen fixed inset-0 flex flex-col items-center bg-brand-bg p-4 md:p-6 font-content">
      <header className="w-full flex justify-between items-center p-2 z-20">
        <button onClick={onBack} className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 transition hover:scale-110">
            <BackIcon />
        </button>
        <div className="text-2xl font-bold bg-white/70 px-6 py-3 rounded-full shadow-md">
          ពិន្ទុ: <span className="text-orange-500">{score}</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl">
        <div 
            className={`w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg min-h-[12rem] flex items-center justify-center flex-wrap gap-4 border-4 transition-all duration-300 ${boxBorderColor} ${animationClass} ${isOverZone ? 'ring-4 ring-orange-400 bg-orange-100' : ''}`}
            onDrop={(e) => handleDrop(e, 'zone')}
            onDragOver={handleDragOver}
            onDragEnter={() => setIsOverZone(true)}
            onDragLeave={() => setIsOverZone(false)}
        >
          {dropZone.length === 0 && <p className="text-gray-400 text-2xl">អូសពាក្យមកទីនេះ</p>}
          {dropZone.map((item) => (
            <button key={item.id} draggable onDragStart={(e) => handleDragStart(e, item, 'zone')} onDragEnd={handleDragEnd} className="text-3xl md:text-4xl font-bold text-brand-text bg-yellow-200 px-4 py-2 rounded-lg shadow-md cursor-grab active:cursor-grabbing animate-pop-in">
              {item.word}
            </button>
          ))}
           {gameState === 'correct' && <div className="text-5xl animate-bounce-in">✅</div>}
        </div>

        <div 
          className="w-full bg-white/60 rounded-2xl p-6 mt-8 shadow-inner min-h-[10rem] flex items-center justify-center flex-wrap gap-4"
          onDrop={(e) => handleDrop(e, 'bank')}
          onDragOver={handleDragOver}
        >
          {wordBank.map((item) => (
            <button
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item, 'bank')}
              onDragEnd={handleDragEnd}
              className={`text-3xl md:text-4xl font-bold text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-200 border-b-4 active:border-b-2 active:translate-y-1 bg-brand-secondary border-blue-700 hover:scale-105 cursor-grab active:cursor-grabbing`}
            >
              {item.word}
            </button>
          ))}
        </div>
        <button onClick={handleReset} className="mt-6 flex items-center justify-center px-6 py-3 text-xl font-bold bg-white rounded-full shadow-md hover:bg-gray-100 transition-transform hover:scale-105 text-gray-700">
          <ResetIcon />
          រៀបចំឡើងវិញ
        </button>
      </main>

      <footer className="w-11/12 md:w-2/3 lg:w-1/2 mb-4">
        <p className="text-center text-xl font-bold text-gray-600 mb-2">
            ល្បះ: {Math.min(currentSentenceIndex + 1, sentences.length)} / {sentences.length}
        </p>
        <div className="h-4 bg-white/50 rounded-full overflow-hidden border-2 border-white/80 shadow-inner">
            <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
            />
        </div>
      </footer>
    </div>
  );
};

export default WordScrambleGame;
