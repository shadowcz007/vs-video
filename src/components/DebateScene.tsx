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
        left: getRandomVotes(12000),
        right: getRandomVotes(12000)
    }), []);

    const progress = interpolate(frame, [0, durationInFrames], [0, 1]);
    
    // 根据当前进度计算票数
    const calculateVotes = (progress: number, isLeft: boolean) => {
        const pattern = competitionPattern.stages;
        
        // 记录历史最高票数
        let highestVotes = 0;
        
        // 遍历所有已经过的阶段，计算累积票数
        for (let i = 0; i < pattern.length; i++) {
            const currentStage = pattern[i];
            if (progress <= currentStage.time) {
                // 计算当前阶段内的进度
                const startStage = i === 0 ? { time: 0, leftRatio: 0, rightRatio: 0 } : pattern[i - 1];
                const stageProgress = interpolate(
                    progress,
                    [startStage.time, currentStage.time],
                    [0, 1],
                    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
                );

                // 获取当前阶段的起始和结束比率
                const startRatio = isLeft ? startStage.leftRatio : startStage.rightRatio;
                const endRatio = isLeft ? currentStage.leftRatio : currentStage.rightRatio;
                
                // 计算增长速度系数（根据竞态关系调整）
                const competitorRatio = isLeft ? currentStage.rightRatio : currentStage.leftRatio;
                const speedMultiplier = endRatio > competitorRatio ? 1.2 : 0.8;
                
                // 使用 spring 函数使增长更平滑
                const currentRatio = spring({
                    frame: stageProgress * 100,
                    fps: 30,
                    config: {
                        damping: 15,
                        mass: 0.5,
                        stiffness: 100 * speedMultiplier
                    }
                }) * (endRatio - startRatio) + startRatio;

                const currentVotes = Math.floor(
                    (isLeft ? finalVotes.left : finalVotes.right) * currentRatio
                );
                
                // 确保票数只增不减
                highestVotes = Math.max(highestVotes, currentVotes);
                return highestVotes;
            }
        }

        // 如果超过所有阶段，返回最终票数
        return isLeft ? finalVotes.left : finalVotes.right;
    };

    const splitProgress = spring({
        frame,
        fps,
        config: { damping: 20 },
        delay: 10
    });

    const textIndex = Math.floor(frame / (durationInFrames / DEBATE_DATA.left.length));
    const leftVotes = calculateVotes(progress, true);
    const rightVotes = calculateVotes(progress, false);

    return (
        <AbsoluteFill>
            <Background 
                frame={frame}
                durationInFrames={durationInFrames}
                splitProgress={splitProgress}
            />
            <SplitterEffect />
            <DebatePoints 
                alignedDebateData={alignedDebateData}
                textIndex={textIndex}
                frame={frame}
                fps={fps}
            />
            <ProgressBar progress={progress} />
            <InteractionHint 
                frame={frame}
                durationInFrames={durationInFrames}
            />
            <VoteCounters 
                leftVotes={leftVotes}
                rightVotes={rightVotes}
                formatVotes={formatVotes}
            />
        </AbsoluteFill>
    );
}; 