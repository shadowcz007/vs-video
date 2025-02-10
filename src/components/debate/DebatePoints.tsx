import React from 'react';
import { spring } from 'remotion';
import { ParticleText } from '../ParticleText';
import { AlignedDebateData } from '../../types/debate';

interface DebatePointsProps {
    alignedDebateData: AlignedDebateData;
    textIndex: number;
    frame: number;
    fps: number;
}

export const DebatePoints: React.FC<DebatePointsProps> = ({
    alignedDebateData,
    textIndex,
    frame,
    fps
}) => {
    const springConfig = { 
        damping: 40,    // 增加阻尼
        mass: 1.5,      // 增加质量
        stiffness: 50 // 降低刚度使动画更自然
    };
 
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            // padding: '0 50px',
            position: 'relative',
            top: '30%',
            transform: 'translateY(-50%)',
            zIndex: 1000
        }}>
            <div className="debate-side left" style={{
                width: '55%',
                position: 'relative',
                top: -120
            }}>
                <ParticleText
                    text={alignedDebateData.left[textIndex] || ''}
                    progress={spring({
                        frame,
                        fps,
                        config: springConfig
                    })}
                    color="#FFFFFF"
                    side="left"
                    visible={true}
                />
            </div>
            <div className="debate-side right" style={{
                width: '55%',
                position: 'relative',
                top: 900,
                left:-98
            }}>
                <ParticleText
                    text={alignedDebateData.right[textIndex] || ''}
                    progress={spring({
                        frame,
                        fps,
                        config: springConfig
                    })}
                    color="#FFFFFF"
                    side="right"
                    visible={true}
                />
            </div>
        </div>
    );
}; 