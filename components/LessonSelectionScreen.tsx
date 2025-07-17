import React from 'react';
import { Lesson } from '../types';

interface LessonSelectionScreenProps {
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
}

const LessonSelectionScreen: React.FC<LessonSelectionScreenProps> = ({ lessons, onSelectLesson }) => {
  return (
    <div className="w-full max-w-7xl mx-auto text-center p-4 md:p-8">
      <h1 
        className="text-4xl md:text-5xl font-content font-bold text-brand-text mb-12 py-4 px-12 bg-white rounded-3xl shadow-2xl inline-block"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}
      >
        ជ្រើសរើសមេរៀន
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {lessons.map((lesson, index) => (
           <button
            key={lesson.lesson_number}
            onClick={() => onSelectLesson(lesson)}
            className="group w-56 h-48 bg-brand-grass rounded-2xl shadow-lg p-2 transform transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl focus:outline-none focus:ring-4 ring-offset-4 ring-brand-secondary ring-offset-brand-sky-light animate-bounce-in"
            style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'backwards' }}
          >
            <div className="bg-brand-earth text-white rounded-xl w-full h-full flex flex-col justify-center items-center text-center p-3 relative shadow-inner">
                <h2 className="text-2xl font-content font-bold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{lesson.lesson_number}</h2>
                <p className="text-base font-content mt-1 text-center px-1 leading-tight" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{lesson.title}</p>
                <div className="absolute bottom-2 right-3 text-xs opacity-80 font-content" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  ទំព័រ {lesson.source_page}
                </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LessonSelectionScreen;