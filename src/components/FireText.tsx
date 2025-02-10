import React from 'react';
import {   useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

// 火焰文字组件
export const FireText = ({ text, durationInFrames = 120 }: { text: string, durationInFrames?: number }) => {
  const frame = useCurrentFrame();

  // 添加缩放动画
  const scale = interpolate(
    frame % (durationInFrames / 2),
    [0, durationInFrames / 4, durationInFrames / 2],
    [1, 1.05, 1],
    {
      extrapolateRight: 'clamp',
    }
  );

  // 添加模糊效果动画
  const blur = interpolate(
    frame % (durationInFrames / 3),
    [0, durationInFrames / 6, durationInFrames / 3],
    [0, 2, 0],
    {
      extrapolateRight: 'clamp',
    }
  );

  // 修改火焰颜色动画，使用更丰富的颜色过渡
  const r = interpolate(
    frame % durationInFrames,
    [0, durationInFrames * 0.3, durationInFrames * 0.6, durationInFrames * 0.9, durationInFrames],
    [255, 255, 255, 255, 255]
  );
  const g = interpolate(
    frame % durationInFrames,
    [0, durationInFrames * 0.3, durationInFrames * 0.6, durationInFrames * 0.9, durationInFrames],
    [50, 165, 220, 255, 50]
  );
  const b = interpolate(
    frame % durationInFrames,
    [0, durationInFrames * 0.3, durationInFrames * 0.6, durationInFrames * 0.9, durationInFrames],
    [0, 0, 0, 200, 0]
  );

  const fireColor = `rgb(${r}, ${g}, ${b})`;

  return (
     <p
        style={{
          fontFamily: "'Arial Black', sans-serif",
          fontSize: 100,
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          textShadow: `black`,
          transition: 'all 0.1s ease-in-out',
        }}
      >
        {text}
      </p> 
  );
};