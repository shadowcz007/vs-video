import React from 'react';
import { useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion';
import { formatVotes, getRandomVotes, } from '../../utils/voteCalculations';
import { CompetitionPattern } from '../../types/debate';
interface VoteCountersProps {
    
}

// 创建通用的计数器样式
const commonCounterStyle: any = {
    fontSize: 98,
    fontWeight: 'bold' as const,
    padding: '10px 20px',
    borderRadius: 12,
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
    ':hover': {
        transform: 'scale(1.05)',
    }
};
 

export const VoteCounters: React.FC<VoteCountersProps> = ( ) => {
    const { fps, durationInFrames } = useVideoConfig();
    const frame = useCurrentFrame();
    // 使用 useMemo 设置最终票数
    const finalVotes = React.useMemo(() => ({
        left: getRandomVotes(20000),
        right: getRandomVotes(20000)
    }), []);



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
                    fps,
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

    const leftVotes = calculateVotes(progress, true);
    const rightVotes = calculateVotes(progress, false);

    const scale = spring({
        frame,
        fps: 30,
        config: {
            damping: 15,
            mass: 0.5,
            stiffness: 100
        }
    });

    const counterStyle = (color: string, top: number = 100) => ({
        ...commonCounterStyle,
        color,
        background: `${color}1a`,
        border: `1px solid ${color}4d`,
        textShadow: `0 2px 10px ${color}80`,
        position: 'absolute' as const,
        top,
        zIndex: 100000,
        transform: `scale(${scale})`
    });

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 100px'
        }}>
            <div style={counterStyle('rgb(255 111 94)', 60)}>
                {formatVotes(leftVotes)}
            </div>
            <div style={{
                ...counterStyle('rgb(60 229 255)', 0),
                left: 600,
                bottom: 80,
                top: 'auto',
                height: 'fit-content'
            }}>
                {formatVotes(rightVotes)}
            </div>
        </div>
    );
}; 