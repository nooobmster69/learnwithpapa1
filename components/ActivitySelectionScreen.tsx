
import React from 'react';
import { Lesson } from '../types';

// --- SVG Icons defined locally to avoid external dependencies ---
const SyllableIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3h-6z"/></svg>
);
const WordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8 16H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V6h2v2zm5 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V6h4v2zm5 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2z"/></svg>
);
const StoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
);
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.41 4.59L18 6l-4.59 1.41L12 12l-1.41-4.59L6 6l4.59-1.41L12 0zm6 12l-1.41 4.59L12 18l4.59 1.41L18 24l1.41-4.59L24 18l-4.59-1.41L18 12zM6 18l-4.59-1.41L0 18l1.41 4.59L6 24l1.41-4.59L12 18l-4.59-1.41L6 18z"/></svg>
);
const PuzzleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1a2.5 2.5 0 0 0-2.5 2.5V5H4c-1.1 0-2 .9-2 2v4h1.5a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 3.5 16H2v4c0 1.1.9 2 2 2h4v-1.5a2.5 2.5 0 0 1 2.5-2.5a2.5 2.5 0 0 1 2.5 2.5V22h4c1.1 0 2-.9 2-2v-4h-1.5a2.5 2.5 0 0 1-2.5-2.5a2.5 2.5 0 0 1 2.5-2.5H22V13c0-1.1-.9-2-1.5-2z"/></svg>
);
// --- End of SVG Icons ---

interface ActivityButtonProps {
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    disabled?: boolean;
}

const ActivityButton: React.FC<ActivityButtonProps> = ({ onClick, label, icon, color, borderColor, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full md:w-64 h-56 flex flex-col items-center justify-center space-y-4 p-4 text-white rounded-3xl shadow-lg transform transition-transform duration-300 ease-in-out ${color} ${borderColor} border-b-8 active:border-b-2 ${!disabled ? 'hover:scale-105 hover:-translate-y-2' : 'opacity-60 cursor-not-allowed'}`}
    >
        {icon}
        <span className="text-2xl md:text-3xl font-content font-bold" style={{textShadow: '2px 2px 2px rgba(0,0,0,0.2)'}}>{label}</span>
    </button>
);


interface ActivitySelectionScreenProps {
  lesson: Lesson;
  onSelectSyllables: () => void;
  onSelectWords: () => void;
  onSelectStory: () => void;
  onSelectAIStory: () => void;
  onSelectWordScramble: () => void;
  onBack: () => void;
}

const ActivitySelectionScreen: React.FC<ActivitySelectionScreenProps> = ({ lesson, onSelectSyllables, onSelectWords, onSelectStory, onSelectAIStory, onSelectWordScramble, onBack }) => {
  const canGenerateAIStory = lesson.syllables?.length > 0 || lesson.words?.length > 0 || lesson.story?.content?.length > 0;
  const canPlayScramble = lesson.story?.content?.filter(s => s.trim().split(' ').length > 1).length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto text-center relative p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl">
        <button onClick={onBack} className="absolute top-6 left-6 p-3 bg-white text-gray-600 rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-all">
            <BackIcon />
        </button>
      <h1 className="text-4xl md:text-5xl font-content font-bold text-brand-text mb-2">{lesson.lesson_number}</h1>
      <h2 className="text-2xl md:text-3xl text-gray-500 mb-12 font-content">{lesson.title}</h2>
      
      <div className="flex flex-wrap items-stretch justify-center gap-8">
        <ActivityButton
            onClick={onSelectSyllables}
            label="ការអានព្យាង្គ"
            icon={<SyllableIcon />}
            color="bg-brand-primary"
            borderColor="border-green-600"
            disabled={!lesson.syllables || lesson.syllables.length === 0}
        />
        <ActivityButton
            onClick={onSelectWords}
            label="ការអានពាក្យ"
            icon={<WordIcon />}
            color="bg-brand-secondary"
            borderColor="border-blue-700"
            disabled={!lesson.words || lesson.words.length === 0}
        />
        <ActivityButton
            onClick={onSelectStory}
            label="ការអានអត្ថបទខ្លី"
            icon={<StoryIcon />}
            color="bg-brand-accent"
            borderColor="border-pink-600"
            disabled={!lesson.story || lesson.story.content.length === 0}
        />
        <ActivityButton
            onClick={onSelectWordScramble}
            label="រៀបពាក្យ"
            icon={<PuzzleIcon />}
            color="bg-orange-500"
            borderColor="border-orange-700"
            disabled={!canPlayScramble}
        />
        <ActivityButton
            onClick={onSelectAIStory}
            label="AI Story Time"
            icon={<SparklesIcon />}
            color="bg-purple-500"
            borderColor="border-purple-700"
            disabled={!canGenerateAIStory}
        />
      </div>
    </div>
  );
};

export default ActivitySelectionScreen;
