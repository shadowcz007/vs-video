import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { DEBATE_DATA } from '../constants';
import React from 'react';
import './DebateScene.css';
import { Background } from './debate/Background';
import { ProgressBar } from './debate/ProgressBar';
import { InteractionHint } from './debate/InteractionHint';
import { VoteCounters } from './debate/VoteCounters';
import { DebatePoints } from './debate/DebatePoints';
import { SplitterEffect } from './SplitterEffect';
import { CompetitionPattern } from '../types/debate';
import { preprocessDebateData, getRandomVotes, formatVotes } from '../utils/voteCalculations';
import { VsBackground } from './debate/VsBackground';

// 使用预处理后的数据
const alignedDebateData = preprocessDebateData(DEBATE_DATA);

export const DebateScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // 随机生成竞争模式
    const competitionPattern = React.useMemo((): CompetitionPattern => {
        const isLeftWinner = Math.random() > 0.5;
        const stageCount = 3 + Math.floor(Math.random() * 3); // 3-5个阶段

        const stages = [];
        let currentTime = 0;
        let leftRatio = Math.random() * 0.5 + 0.2; // 0.2-0.7
        let rightRatio = Math.random() * 0.5 + 0.2;

        // 生成中间阶段
        for (let i = 0; i < stageCount; i++) {
            currentTime += (1 / stageCount) * (0.8 + Math.random() * 0.4); // 添加一些随机性
            if (currentTime > 1) currentTime = 1;

            // 随机调整比率
            leftRatio = Math.random() * 0.7 + 0.2;
            rightRatio = Math.random() * 0.7 + 0.2;

            stages.push({
                time: currentTime,
                leftRatio,
                rightRatio,
            });
        }

        // 确保最后一个阶段winner获胜
        const lastStage = stages[stages.length - 1];
        if (isLeftWinner) {
            lastStage.leftRatio = 1;
            lastStage.rightRatio = 0.7 + Math.random() * 0.2;
        } else {
            lastStage.rightRatio = 1;
            lastStage.leftRatio = 0.7 + Math.random() * 0.2;
        }

        return {
            stages,
            winner: isLeftWinner ? 'left' : 'right'
        };
    }, []);

    // 使用 useMemo 设置最终票数
    const finalVotes = React.useMemo(() => ({
        left: getRandomVotes(20000),
        right: getRandomVotes(20000)
    }), []);

    const progress = interpolate(frame, [0, durationInFrames], [0, 1]);

    // 根据当前进度计算票数
    const calculateVotes = (progress: number, isLeft: boolean) => {
        const pattern = competitionPattern.stages;
        let highestVotes = 0;

        for (let i = 0; i < pattern.length; i++) {
            const currentStage = pattern[i];
            if (progress <= currentStage.time) {
                const startStage = i === 0 ? { time: 0, leftRatio: 0, rightRatio: 0 } : pattern[i - 1];
                const stageProgress = interpolate(
                    progress,
                    [startStage.time, currentStage.time],
                    [0, 1],
                    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
                );

                const startRatio = isLeft ? startStage.leftRatio : startStage.rightRatio;
                const endRatio = isLeft ? currentStage.leftRatio : currentStage.rightRatio;
                
                // 降低速度倍率的差异
                const competitorRatio = isLeft ? currentStage.rightRatio : currentStage.leftRatio;
                const speedMultiplier = endRatio > competitorRatio ? 1.1 : 0.9; // 原来是 1.2 和 0.8

                // 调整 spring 参数使动画更平滑
                const currentRatio = spring({
                    frame: stageProgress * 100,
                    fps: 30,
                    config: {
                        damping: 25, // 增加阻尼，原来是 15
                        mass: 1, // 增加质量，原来是 0.5
                        stiffness: 80 * speedMultiplier // 降低刚度，原来是 100
                    }
                }) * (endRatio - startRatio) + startRatio;

                const currentVotes = Math.floor(
                    (isLeft ? finalVotes.left : finalVotes.right) * currentRatio
                );

                highestVotes = Math.max(highestVotes, currentVotes);
                return highestVotes;
            }
        }

        return isLeft ? finalVotes.left : finalVotes.right;
    };

    const splitProgress = spring({
        frame,
        fps,
        config: { damping: 20 },
        delay: 10
    });

    const textIndex = Math.floor(frame / (360 / DEBATE_DATA.left.length));
    const leftVotes = calculateVotes(progress, true);
    const rightVotes = calculateVotes(progress, false);

    // 计算是否应该显示VS背景
    const shouldShowVs = frame >= fps * 1.5; // 1.5秒后显示
    const shouldShowSplitterEffect = frame >= fps * 2; // 2秒后显示
    const shouldShowDebatePoints = frame >= fps * 2.5; // 2.5秒后显示

    return (
        <AbsoluteFill>

            <Background
                frame={frame}
                durationInFrames={durationInFrames}
                splitProgress={splitProgress}
            />
            {shouldShowVs && <VsBackground />}
            {shouldShowSplitterEffect && <SplitterEffect />}
            {shouldShowDebatePoints && <DebatePoints
                alignedDebateData={alignedDebateData}
                textIndex={textIndex}
                frame={frame}
                fps={fps}
            />}

            {shouldShowDebatePoints && <VoteCounters
                leftVotes={leftVotes}
                rightVotes={rightVotes}
                formatVotes={formatVotes}
            />}
        </AbsoluteFill>
    );
}; 