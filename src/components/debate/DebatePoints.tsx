import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { ParticleText } from '../ParticleText';
import { AlignedDebateData } from '../../types/debate';
import { FireText } from '../FireText';


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

    return (
        <div style={{}}>
            <div className="debate-side left" style={{
                position: 'absolute',
                top: 452,
                left: 48,
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
                transform: 'translate(-50%, -50%)',
                zIndex: 99999
            }}>
                <img 
                    src={staticFile('debate-center.png')} 
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
                bottom: 500,
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