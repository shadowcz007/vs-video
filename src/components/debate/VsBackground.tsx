import React from 'react';
// 假设你的SVG文件保存在 assets 目录下
import vsBackgroundSvg from '../../assets/bg.svg';

export const VsBackground: React.FC = () => {
  return (
    <div 
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
        backgroundImage: `url(${vsBackgroundSvg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* VS标志 */}
      <svg 
        viewBox="0 0 40 40"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px'
        }}
      >
        <circle
          cx="20"
          cy="20"
          r="15"
          fill="white"
          stroke="#000"
          strokeWidth="2"
        />
        <text
          x="20"
          y="25"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          fill="#000"
        >
          VS
        </text>
      </svg>
    </div>
  );
};