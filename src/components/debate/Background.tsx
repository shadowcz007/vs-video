import React from 'react';
import { interpolate, spring } from 'remotion';

interface BackgroundProps {
  frame: number;
  durationInFrames: number;
  splitProgress: number;
}

export const Background: React.FC<BackgroundProps> = ({
  frame,
  durationInFrames,
  splitProgress,
}) => (
  <div style={{
    display: 'flex',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  }}>
    <div style={{
      flex: 1,
      background: 'linear-gradient(135deg, #FF3355 0%, #FF6666 100%)',
      transform: `scaleX(${splitProgress})`,
      transformOrigin: 'left center',
      opacity: interpolate(frame, [0, durationInFrames], [0.8, 1]),
      boxShadow: 'inset 0 0 50px rgba(255,255,255,0.2)',
      transition: 'all 0.3s ease',
    }} />
    <div style={{
      flex: 1,
      background: 'linear-gradient(135deg, #3366FF 0%, #6699FF 100%)',
      transform: `scaleX(${splitProgress})`,
      transformOrigin: 'right center',
      opacity: interpolate(frame, [0, durationInFrames], [0.8, 1]),
      boxShadow: 'inset 0 0 50px rgba(255,255,255,0.2)',
      transition: 'all 0.3s ease',
    }} />
  </div>
); 