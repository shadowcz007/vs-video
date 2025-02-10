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


export const VoteCounters: React.FC<VoteCountersProps> = () => {
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
        const stageCount = 3; // 固定为3个阶段

        const stages = [];
        let currentTime = 0;
        let leftRatio = Math.random() * 0.5 + 0.2; // 0.2-0.7
        let rightRatio = Math.random() * 0.5 + 0.2;

        // 生成中间阶段
        for (let i = 0; i < stageCount; i++) {
            currentTime += 1 / 3; // 平均分配时间
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

    // 添加状态来记录之前的票数
    const [prevLeftVotes, setPrevLeftVotes] = React.useState(0);
    const [prevRightVotes, setPrevRightVotes] = React.useState(0);

    // 根据当前进度计算票数
    const calculateVotes = React.useCallback((progress: number, isLeft: boolean) => {
        const pattern = competitionPattern.stages;
        
        // 找到当前所在的阶段
        const currentStageIndex = pattern.findIndex(stage => progress <= stage.time);
        const currentStage = currentStageIndex === -1 ? pattern[pattern.length - 1] : pattern[currentStageIndex];
        const prevStage = currentStageIndex <= 0 ? 
            { time: 0, leftRatio: 0, rightRatio: 0 } : 
            pattern[currentStageIndex - 1];

        // 计算阶段内的进度，添加更平滑的弹性动画
        const stageProgress = spring({
            frame: frame,
            fps,
            config: {
                damping: 60,
                mass: 0.8,
                stiffness: 100
            }
        });

        // 计算当前比率
        const startRatio = isLeft ? prevStage.leftRatio : prevStage.rightRatio;
        const endRatio = isLeft ? currentStage.leftRatio : currentStage.rightRatio;
        
        // 使用 interpolate 进行平滑插值
        const currentRatio = interpolate(
            stageProgress,
            [0, 1],
            [startRatio, endRatio],
            {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: (t) => t * t * (3 - 2 * t)
            }
        );

        // 计算新的票数
        const newVotes = Math.round(
            (isLeft ? finalVotes.left : finalVotes.right) * currentRatio
        );

        return newVotes;
    }, [frame, fps, competitionPattern.stages, finalVotes]);

    // 使用 useMemo 缓存计算结果
    const leftVotes = React.useMemo(() => calculateVotes(progress, true), [calculateVotes, progress]);
    const rightVotes = React.useMemo(() => calculateVotes(progress, false), [calculateVotes, progress]);

   
    const counterStyle = (color: string, top: number = 100) => ({
        ...commonCounterStyle,
        color,
        background: `${color}1a`,
        border: `1px solid ${color}4d`,
        textShadow: `0 2px 10px ${color}80`,
        position: 'absolute' as const,
        top,
        zIndex: 100000, 
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