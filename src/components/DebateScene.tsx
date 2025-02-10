import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { DEBATE_DATA } from '../constants';
import React from 'react';
import { Background } from './debate/Background';
import { VoteCounters } from './debate/VoteCounters';
import { DebatePoints } from './debate/DebatePoints';
import { SplitterEffect } from './SplitterEffect';
 
import { VsBackground } from './debate/VsBackground';

// 使用预处理后的数据
const alignedDebateData = DEBATE_DATA;

export const DebateScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // 确保左右两边数据长度一致，并使用总时长来计算每组数据的显示时间
    if (DEBATE_DATA.left.length !== DEBATE_DATA.right.length) {
        console.warn('左右辩论数据长度不一致！');
    }
    const ITEM_DURATION = durationInFrames / DEBATE_DATA.left.length;

    const textIndex = Math.floor(frame / ITEM_DURATION);

    // 计算是否应该显示
    const shouldShowSplitterEffect = frame >= fps * 1; // 2秒后显示
    const shouldShowDebatePoints = frame >= fps * 0.6; // 2.5秒后显示

    return (
        <AbsoluteFill>
            <VsBackground />
           <Background /> 
            
            {shouldShowSplitterEffect && <SplitterEffect />}
            {shouldShowDebatePoints && <DebatePoints
                alignedDebateData={alignedDebateData}
                textIndex={textIndex}
                frame={frame}
                fps={fps}
            />}

            {/* {shouldShowDebatePoints && <VoteCounters />} */}
        </AbsoluteFill>
    );
}; 