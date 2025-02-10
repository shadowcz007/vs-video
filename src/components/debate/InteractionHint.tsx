import React from 'react';
import { interpolate, spring } from 'remotion';

interface InteractionHintProps {
    frame: number;
    durationInFrames: number;
}

export const InteractionHint: React.FC<InteractionHintProps> = ({
    frame,
    durationInFrames
}) => {
    const opacity = interpolate(
        frame,
        [0, 30, durationInFrames - 30, durationInFrames],
        [0, 1, 1, 0]
    );

    return (
        <div style={{
            position: 'absolute',
            bottom: 100,
            width: '100%',
            textAlign: 'center',
            color: '#fff',
            fontSize: 24,
            opacity,
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: 12,
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.2)',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            transform: `translateY(${spring({
                frame,
                fps: 30,
                config: { damping: 15 }
            }) * 10}px)`,
            zIndex: 100000
        }}>
            点击左右两侧进行投票
        </div>
    );
}; 