import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from 'remotion';
import { ParticleText } from '../ParticleText';
import { AlignedDebateData } from '../../types/debate';
import   {FireText}  from '../FireText';

let audio=staticFile("/output_sound.wav")

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
            <Audio
                src={audio}
                startFrom={textIndex * fps} // 在每个文本切换时播放
                endAt={(textIndex + 1) * fps}
            />
            <div className="debate-side left" style={{
               position: 'absolute',
               top: 312,
               left: 48,
               width: '60%', 
               zIndex: 100000
            }}>
                <FireText
                    text={leftText} 
                />
            </div>
            <div className="debate-side right" style={{
              position: 'absolute',
              bottom:380,
              left: '30%',
              width: '60%', 
              zIndex: 100000
            }}>
                <FireText
                    text={rightText}  
                />
            </div>
        </div>
    );
}; 