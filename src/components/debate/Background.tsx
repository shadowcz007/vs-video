import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
interface BackgroundProps {
}

export const Background: React.FC<BackgroundProps> = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const splitProgress = spring({
        frame,
        fps,
        config: { damping: 20 },
        delay: 1
    });

    const scale = spring({
        frame,
        fps,
        from: 0,
        to: 1,
        durationInFrames: 40, // 明确指定持续时间
        config: {
            damping: 12,
        },
    });

    const opacity = interpolate(
        frame,
        [0, durationInFrames],
        [0.8, 1]
    );

    return (
        <div style={{
            display: 'flex',
            width: '110%',
            height: '100%',
            position: 'absolute',
            top: 0,
            overflow: 'hidden',
            transform: 'rotate(21deg) scale(1.5) translate(-33px, 0px)'
        }}>
            <div style={{
                flex: 1,
                background: 'linear-gradient(45deg, #1a3a6e 0%, #2d5ca8 100%)',
                transform: `scaleX(${scale})`,
                transformOrigin: 'left center',
                opacity,
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)',
            }} />
            <div style={{
                flex: 1,
                background: 'linear-gradient(45deg, #8b1818 0%, #c93434 100%)',
                transform: `scaleX(${scale})`,
                transformOrigin: 'right center',
                opacity,
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)',
            }} />
        </div>
    );
} 