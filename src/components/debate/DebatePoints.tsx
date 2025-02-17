import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { ParticleText } from '../ParticleText';
import { AlignedDebateData } from '../../types/debate';
import { FireText } from '../FireText';


interface DebatePointsProps {
    alignedDebateData: AlignedDebateData & { centerImage?: string };
    textIndex: number;
    frame: number;
    fps: number;
    toggleText: number[];
}

export const DebatePoints: React.FC<DebatePointsProps> = ({
    alignedDebateData,
    textIndex,
    frame,
    fps,
    toggleText
}) => {

    // 添加获取最后有效文本的逻辑
    const getLastValidText = (texts: string[], currentIndex: number) => {
        for (let i = currentIndex; i >= 0; i--) {
            if (texts[i]) {
                return texts[i];
            }
        }
        return '';
    };

    const leftText = alignedDebateData.left[textIndex] || getLastValidText(alignedDebateData.left, textIndex - 1);
    const rightText = alignedDebateData.right[textIndex] || getLastValidText(alignedDebateData.right, textIndex - 1);

    // 修改抖动动画逻辑
    const shakeDuration = fps*0.3; // 1秒的持续时间
    
    const getShakeAnimation = (currentFrame: number) => {
        // 找到最近的触发帧
        const activeShakeFrame = toggleText.find(startFrame => 
            currentFrame >= startFrame && currentFrame <= startFrame + shakeDuration
        );

        if (!activeShakeFrame) {
            return { x: 0, y: 0 };
        }
        
        const progress = (currentFrame - activeShakeFrame) / shakeDuration;
        const intensity = spring({
            frame: currentFrame - activeShakeFrame,
            fps,
            config: {
                damping: 5,
                mass: 0.5,
                stiffness: 100,
            }
        });
        
        return {
            x: Math.sin(progress * Math.PI * 8) * 10 * intensity,
            y: Math.cos(progress * Math.PI * 6) * 10 * intensity,
        };
    };

    const shakeOffset = getShakeAnimation(frame);

    return (
        <div style={{}}>
            <div className="debate-side left" style={{
                position: 'absolute',
                top: 502,
                left: 60,
                zIndex: 100000
            }}>
                <FireText
                    text={leftText}
                />
            </div>

            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translate(${shakeOffset.x}px, ${shakeOffset.y}px)`,
                zIndex: 99999
            }}>
                <img 
                    src={alignedDebateData.centerImage || staticFile('debate-center.png')} 
                    alt="Debate Center"
                    style={{
                        width: 300,
                        borderRadius:88,
                        height: 'auto'
                    }}
                />
            </div>

            <div className="debate-side right" style={{
                position: 'absolute',
                bottom: 580,
                right: 88,
                zIndex: 100000
            }}>
                <FireText
                    text={rightText}
                />
            </div>
        </div>
    );
}; 