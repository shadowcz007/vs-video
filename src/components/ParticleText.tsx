import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import React from "react";

interface ParticleTextProps {
    text: string;
    color: string;
    side: 'left' | 'right';
    visible: boolean;
    style?: React.CSSProperties;
    particleCount?: number;
    particleSize?: number;
    progress: number;
}

export const ParticleText: React.FC<ParticleTextProps> = React.memo(({ 
    text, 
    color, 
    side, 
    visible, 
    style,
    particleCount = 50,
    particleSize = 2,
    progress = 0
}) => {
    const frame = useCurrentFrame();
    const { width } = useVideoConfig();

    const particleOffset = interpolate(frame, [0, 15], [width * (side === 'left' ? -1 : 1), 0], {
        extrapolateRight: "clamp",
    });

    const containerStyle = React.useMemo(() => ({
        position: 'relative' as const,
        ...style,
        willChange: 'transform',
        opacity: progress,
        transform: `scale(${progress})`,
        transition: 'opacity 0.3s, transform 0.3s',
    }), [style, progress]);

    const particles = React.useMemo(() => {
        return Array.from({ length: Math.min(particleCount, 50) }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 50; // 控制扩散范围
            return {
                angle,
                radius,
                speed: Math.random() * 1.5 + 0.5,
                delay: Math.random() * Math.PI * 2,
            };
        });
    }, [particleCount]);

    const getParticleStyle = React.useCallback((particle: typeof particles[0], index: number) => {
        const time = frame * 0.1 + particle.delay;
        const currentRadius = particle.radius + Math.sin(time) * particle.speed * 10;
        const x = Math.cos(particle.angle) * currentRadius;
        const y = Math.sin(particle.angle) * currentRadius;

        return {
            position: 'absolute' as const,
            left: '50%',
            top: '50%',
            width: particleSize,
            height: particleSize,
            background: color,
            borderRadius: '50%',
            opacity: 0.6 - (currentRadius / 100), // 随距离淡出
            transform: `translate3d(${x}px, ${y}px, 0)`,
            transition: 'transform 0.1s linear',
            willChange: 'transform',
        };
    }, [frame, particleSize, color]);

    if (!visible) return null;

    return (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: `translate3d(${particleOffset}px, 0, 0)`,
                willChange: 'transform',
                pointerEvents: 'none',
            }}>
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        style={getParticleStyle(particle, i)}
                    />
                ))}
            </div>
            
            <div style={{
                color,
                fontFamily: 'Inter',
                fontSize: '4.5vw',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                textShadow: `0 0 10px ${color}80`,
                transform: `translate3d(${particleOffset}px, 0, 0)`,
                willChange: 'transform',
                width: '100%',
                textAlign: side === 'left' ? 'right' : 'left',
                padding: 20,
            }}>
                {text}
            </div>
        </div>
    );
}); 