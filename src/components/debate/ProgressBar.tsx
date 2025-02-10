import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <>
    <div style={{
      position: 'absolute',
      bottom: 380,
      width: '94%',
      height: 32,
      backgroundColor: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      left: '3%',
      zIndex: 99999,
      borderRadius: 16,
      boxShadow: `
        0 4px 15px rgba(0,0,0,0.3),
        inset 0 0 20px rgba(255,255,255,0.1)
      `,
      border: '1px solid rgba(255,255,255,0.2)',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${progress * 100}%`,
        height: '100%',
        background: 'linear-gradient(90deg, rgba(255,51,85,0.8), rgba(51,102,255,0.8))',
        borderRadius: 16,
        boxShadow: `
          inset 0 0 30px rgba(255,255,255,0.3),
          0 0 20px rgba(255,51,85,0.4),
          0 0 40px rgba(51,102,255,0.3)
        `,
        transition: 'width 0.3s ease',
      }} />
    </div>
    <div style={{
      position: 'absolute',
      bottom: 200,
      left: '50%',
      transform: 'translateX(-50%)',
      color: '#fff',
      fontSize: 44,
      fontWeight: 'bold',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
      zIndex: 100000,
      backgroundColor: 'rgb(255 255 255 / 10%)',
      borderRadius: 44,
      padding: '10px 20px',
    }}>
      {Math.round(progress * 100)}<span style={{fontSize: 32}}> %</span>
    </div>
  </>
); 