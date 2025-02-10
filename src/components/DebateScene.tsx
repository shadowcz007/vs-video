import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { DEBATE_DATA } from '../constants';
import React from 'react';
import { Background } from './debate/Background';
import { VoteCounters } from './debate/VoteCounters';
import { DebatePoints } from './debate/DebatePoints';
import { SplitterEffect } from './SplitterEffect';

import { preprocessDebateData } from '../utils/voteCalculations';
import { VsBackground } from './debate/VsBackground';

// 使用预处理后的数据
const alignedDebateData = preprocessDebateData(DEBATE_DATA);

export const DebateScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const ITEM_DURATION = (durationInFrames - fps * 2.5) / DEBATE_DATA.left.length; // 每组数据的显示时长
    const textIndex = Math.floor(frame / ITEM_DURATION);

    // 计算是否应该显示VS背景
    const shouldShowVs = frame >= fps * 1.5; // 1.5秒后显示
    const shouldShowSplitterEffect = frame >= fps * 2; // 2秒后显示
    const shouldShowDebatePoints = frame >= fps * 2.5; // 2.5秒后显示

    return (
        <AbsoluteFill>
            <Background />
            {shouldShowVs && <VsBackground />}
            {shouldShowSplitterEffect && <SplitterEffect />}
            {shouldShowDebatePoints && <DebatePoints
                alignedDebateData={alignedDebateData}
                textIndex={textIndex}
                frame={frame}
                fps={fps}
            />}

            {shouldShowDebatePoints && <VoteCounters />}
        </AbsoluteFill>
    );
}; 