import React from 'react';
import { useColorScheme } from '@mui/material/styles';

const Loader = ({ message = "AI Assistant is working", subMessage = "Generating your content..." }) => {
  const { mode } = useColorScheme();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 100%)'
          : 'linear-gradient(135deg, rgb(239, 246, 255) 0%, rgb(255, 255, 255) 100%)'
      }}
    >
      <div className="loader-container relative">
        <div className="rotate-slow absolute -inset-8">
          <div 
            className="w-32 h-32 rounded-full border-2 opacity-30"
            style={{
              borderColor: mode === 'dark' ? 'rgb(59, 130, 246)' : 'rgb(191, 219, 254)',
              borderTopColor: mode === 'dark' ? 'rgb(99, 102, 241)' : 'rgb(59, 130, 246)'
            }}
          ></div>
        </div>
        
        <div className="rotate-fast absolute -inset-4">
          <div 
            className="w-24 h-24 rounded-full border opacity-50"
            style={{
              borderColor: mode === 'dark' ? 'rgb(79, 70, 229)' : 'rgb(147, 197, 253)',
              borderRightColor: mode === 'dark' ? 'rgb(129, 140, 248)' : 'rgb(37, 99, 235)'
            }}
          ></div>
        </div>
        
        <div 
          className="main-circle relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: mode === 'dark'
              ? 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(129, 140, 248) 100%)'
              : 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%)'
          }}
        >
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
            <path 
              className="brain-wave" 
              d="M12 2C8.5 2 6 4.5 6 8c0 1.5 0.5 3 1.5 4 0.5 0.5 1 1 1 1.5 0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5c0-0.5 0.5-1 1-1.5 1-1 1.5-2.5 1.5-4 0-3.5-2.5-6-6-6z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none"
            />
            <circle cx="9" cy="7" r="1" fill="currentColor" className="neural-dot"/>
            <circle cx="15" cy="7" r="1" fill="currentColor" className="neural-dot"/>
            <circle cx="12" cy="9" r="1" fill="currentColor" className="neural-dot"/>
            <circle cx="10" cy="11" r="0.5" fill="currentColor" className="neural-dot"/>
            <circle cx="14" cy="11" r="0.5" fill="currentColor" className="neural-dot"/>
            <circle cx="12" cy="13" r="0.5" fill="currentColor" className="neural-dot"/>
            
            <line x1="9" y1="7" x2="12" y2="9" stroke="currentColor" strokeWidth="0.5" className="neural-dot opacity-60"/>
            <line x1="15" y1="7" x2="12" y2="9" stroke="currentColor" strokeWidth="0.5" className="neural-dot opacity-60"/>
            <line x1="12" y1="9" x2="10" y2="11" stroke="currentColor" strokeWidth="0.5" className="neural-dot opacity-60"/>
            <line x1="12" y1="9" x2="14" y2="11" stroke="currentColor" strokeWidth="0.5" className="neural-dot opacity-60"/>
          </svg>
        </div>
        
        <div className="absolute -inset-12 pointer-events-none">
          <div 
            className="neural-dot absolute top-2 left-4 w-1 h-1 rounded-full"
            style={{ backgroundColor: mode === 'dark' ? 'rgb(129, 140, 248)' : 'rgb(96, 165, 250)' }}
          ></div>
          <div 
            className="neural-dot absolute top-8 right-2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: mode === 'dark' ? 'rgb(99, 102, 241)' : 'rgb(147, 197, 253)' }}
          ></div>
          <div 
            className="neural-dot absolute bottom-4 left-2 w-1 h-1 rounded-full"
            style={{ backgroundColor: mode === 'dark' ? 'rgb(79, 70, 229)' : 'rgb(59, 130, 246)' }}
          ></div>
          <div 
            className="neural-dot absolute bottom-2 right-6 w-0.5 h-0.5 rounded-full"
            style={{ backgroundColor: mode === 'dark' ? 'rgb(109, 40, 217)' : 'rgb(37, 99, 235)' }}
          ></div>
          <div 
            className="neural-dot absolute top-4 right-8 w-1 h-1 rounded-full"
            style={{ backgroundColor: mode === 'dark' ? 'rgb(129, 140, 248)' : 'rgb(96, 165, 250)' }}
          ></div>
          <div 
            className="neural-dot absolute bottom-8 left-6 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: mode === 'dark' ? 'rgb(99, 102, 241)' : 'rgb(147, 197, 253)' }}
          ></div>
        </div>
      </div>
      
      <div className="absolute mt-32 text-center">
        <div 
          className="font-semibold text-lg mb-2"
          style={{ color: mode === 'dark' ? 'rgb(129, 140, 248)' : 'rgb(37, 99, 235)' }}
        >
          {message}
        </div>
        <div className="flex justify-center space-x-1">
          <div 
            className="typing-dot w-2 h-2 rounded-full"
            style={{ backgroundColor: mode === 'dark' ? 'rgb(99, 102, 241)' : 'rgb(59, 130, 246)' }}
          ></div>
          <div 
            className="typing-dot w-2 h-2 rounded-full"
            style={{ backgroundColor: mode === 'dark' ? 'rgb(99, 102, 241)' : 'rgb(59, 130, 246)' }}
          ></div>
          <div 
            className="typing-dot w-2 h-2 rounded-full"
            style={{ backgroundColor: mode === 'dark' ? 'rgb(99, 102, 241)' : 'rgb(59, 130, 246)' }}
          ></div>
        </div>
        <div 
          className="text-sm mt-3 opacity-75"
          style={{ color: mode === 'dark' ? 'rgb(148, 163, 184)' : 'rgb(96, 165, 250)' }}
        >
          {subMessage}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px ${mode === 'dark' ? 'rgba(99, 102, 241, 0.5)' : 'rgba(59, 130, 246, 0.5)'};
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px ${mode === 'dark' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(59, 130, 246, 0.8)'};
            transform: scale(1.05);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes typing {
          0%, 20% { transform: translateY(0); }
          10% { transform: translateY(-4px); }
        }
        
        @keyframes neural-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes brain-wave {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        
        .neural-dot {
          animation: neural-pulse 2s ease-in-out infinite;
        }
        
        .neural-dot:nth-child(2) { animation-delay: 0.2s; }
        .neural-dot:nth-child(3) { animation-delay: 0.4s; }
        .neural-dot:nth-child(4) { animation-delay: 0.6s; }
        .neural-dot:nth-child(5) { animation-delay: 0.8s; }
        .neural-dot:nth-child(6) { animation-delay: 1s; }
        
        .typing-dot {
          animation: typing 1.4s ease-in-out infinite;
        }
        
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        .brain-wave {
          stroke-dasharray: 10;
          animation: brain-wave 3s ease-in-out infinite;
        }
        
        .loader-container {
          animation: float 3s ease-in-out infinite;
        }
        
        .main-circle {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .rotate-slow {
          animation: rotate 8s linear infinite;
        }
        
        .rotate-fast {
          animation: rotate 3s linear infinite reverse;
        }
      `}</style>
    </div>
  );
};

export default Loader;
