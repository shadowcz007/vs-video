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
      background: 'linear-gradient(45deg, #1a3a6e 0%, #2d5ca8 100%)',
      transform: `scaleX(${splitProgress})`,
      transformOrigin: 'left center',
      opacity: interpolate(frame, [0, durationInFrames], [0.8, 1]),
      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
    }} />
    <div style={{
      flex: 1,
      background: 'linear-gradient(45deg, #8b1818 0%, #c93434 100%)',
      transform: `scaleX(${splitProgress})`,
      transformOrigin: 'right center',
      opacity: interpolate(frame, [0, durationInFrames], [0.8, 1]),
      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
    }} />
  </div>
); 