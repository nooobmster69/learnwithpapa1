import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const SunMascot = () => (
    <div className="relative w-48 h-48 animate-float">
        <div className="absolute inset-0 bg-yellow-400 rounded-full shadow-2xl"></div>
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-around">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
            </div>
             <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
            </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-red-400 rounded-b-full border-4 border-white"></div>
    </div>
)


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center space-y-8 p-8">
      <SunMascot />
      <h1 className="text-6xl md:text-8xl font-content font-bold text-brand-text tracking-wide" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
        តោះរៀនជាមួយប៉ាៗ
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 max-w-md font-content">
        ត្រៀមខ្លួន​សម្រាប់​ការ​រៀន​អក្សរ​ខ្មែរ​ហើយ​ឬនៅ​ កូនប៉ាៗ?
      </p>
      <button
        onClick={onStart}
        className="px-16 py-6 text-4xl font-content font-bold text-white bg-brand-primary rounded-full shadow-lg transform hover:scale-110 hover:rotate-3 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 border-b-8 border-green-600 active:border-b-2"
      >
        តោះចាប់ផ្តើម!
      </button>
    </div>
  );
};

export default WelcomeScreen;