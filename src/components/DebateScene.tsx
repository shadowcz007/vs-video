import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { ParticleText } from './ParticleText';
import { SplitterEffect } from './SplitterEffect';
import { DEBATE_DATA } from '../constants';
import React from 'react';
import './DebateScene.css'; // 引入 CSS 文件

// 预处理函数，用于对齐文本
const preprocessDebateData = (data: typeof DEBATE_DATA) => {
    const maxLength = Math.max(
        ...data.left.map(text => text.length),
        ...data.right.map(text => text.length)
    );

    const alignedLeft = data.left.map(text => text.padEnd(maxLength, '——'));
    const alignedRight = data.right.map(text => text.padEnd(maxLength, '——'));

    return { left: alignedLeft, right: alignedRight };
};

// 使用预处理后的数据
const alignedDebateData = preprocessDebateData(DEBATE_DATA);

// 添加新的状态和动画控制函数
const getRandomVotes = (base: number) => base + Math.floor(Math.random() * 1000);
const formatVotes = (num: number) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
};

// 定义竞争模式类型
type CompetitionPattern = {
    stages: { time: number; leftRatio: number; rightRatio: number; }[];
    winner: 'left' | 'right';
};

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

    const leftVotes = calculateVotes(progress, true);
    const rightVotes = calculateVotes(progress, false);

    const splitProgress = spring({
        frame,
        fps,
        config: { damping: 20 },
        delay: 10
    });

    const textIndex = Math.floor(frame / (durationInFrames / DEBATE_DATA.left.length));

    return (
        <AbsoluteFill>
            {/* 背景动画 - 动态渐变 + 闪烁 */}
            <div style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                animation: 'backgroundPulse 5s infinite alternate', // 添加背景动画
            }}>
                <div style={{
                    flex: 1,
                    backgroundColor: '#FF3355',
                    transform: `scaleX(${splitProgress})`,
                    transformOrigin: 'left center',
                    opacity: interpolate(frame, [0, durationInFrames], [0.8, 1]), // 闪烁效果
                }} />
                <div style={{
                    flex: 1,
                    backgroundColor: '#3366FF',
                    transform: `scaleX(${splitProgress})`,
                    transformOrigin: 'right center',
                    opacity: interpolate(frame, [0, durationInFrames], [0.8, 1]), // 闪烁效果
                }} />
            </div>

            <SplitterEffect />

            {/* 论点展示 - 粒子效果增强 */}
            {alignedDebateData.left.map((text, i) => (
                <ParticleText
                    key={`left-${i}`}
                    text={text}
                    color="linear-gradient(45deg, #FFFFFF, #FFE0E0)"
                    side="left"
                    visible={i === textIndex}
                    style={{
                        textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6)',
                        transform: `scale(${spring({ 
                            frame, 
                            fps, 
                            config: { 
                                mass: 0.5, 
                                stiffness: 120,
                                damping: 14
                            } 
                        })})`,
                        filter: `blur(${interpolate(frame, [0, 5], [10, 0])}px)`,
                        opacity: interpolate(frame, [0, 10], [0, 1]),
                        position: 'absolute',
                        left: 24,
                        width: '45%',
                        top: '35%'
                    }}
                    particleCount={5 + textIndex * 10}
                    particleSize={interpolate(frame,[0,10],[6,12])}
                />
            ))}

            {alignedDebateData.right.map((text, i) => (
                <ParticleText
                    key={`right-${i}`}
                    text={text}
                    color="linear-gradient(135deg, #FFFFFF, #E0E8FF)"
                    side="right"
                    visible={i === textIndex}
                    style={{
                        textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6)',
                        transform: `scale(${spring({ 
                            frame, 
                            fps, 
                            config: { 
                                mass: 0.5, 
                                stiffness: 120,
                                damping: 14
                            } 
                        })})`,
                        filter: `blur(${interpolate(frame, [0, 5], [10, 0])}px)`,
                        opacity: interpolate(frame, [0, 10], [0, 1]),
                        position: 'absolute',
                        right: 24,
                        width: '45%',
                        top: '35%'
                    }}
                    particleCount={10 + textIndex * 50}
                    particleSize={interpolate(frame,[0,10],[6,12])}
                />
            ))}

            {/* 进度条优化 */}
            <div style={{
                position: 'absolute',
                bottom: 380,  // 位置上移
                width: '94%',  // 更宽
                height: 32,  // 更高
                backgroundColor: 'rgba(255,255,255,0.1)',
                left: '3%',
                zIndex: 99999,
                borderRadius: 8,
                boxShadow: '0 4px 15px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.2)',
                border: '2px solid rgba(255,255,255,0.15)'
            }}>
                <div style={{
                    width: `${progress * 100}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, 
                        rgba(255,51,85,0.9), 
                        rgba(51,102,255,0.9))`,
                    borderRadius: 6,
                    boxShadow: `
                        inset 0 0 20px rgba(255,255,255,0.5),
                        0 0 30px rgba(255,51,85,0.6),
                        0 0 50px rgba(51,102,255,0.4)
                    `,
                    transition: 'all 0.3s ease',
                    animation: 'progressPulse 2s infinite',
                    backdropFilter: 'blur(8px)',
                }} />
            </div>

            {/* 添加进度百分比显示 */}
            <div style={{
                position: 'absolute',
                bottom: 200,
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#fff',
                fontSize: 44,
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                zIndex: 100000,
                backgroundColor: 'rgb(255 255 255 / 10%)',
                borderRadius: 44,
                padding: '10px 20px',
            }}>
                {Math.round(progress * 100)}<span style={{fontSize: 32}}> %</span>
            </div>

            {/* 交互提示优化 */}
            <div style={{
                position: 'absolute',
                bottom: 72,
                width: '100%',
                textAlign: 'center',
                color: '#fff',
                fontSize: 36,
                fontWeight: 'bold',
                animation: 'pulse 2s infinite',
                textShadow: '0 4px 8px rgba(0,0,0,0.7)',
                WebkitTextStroke: '1px rgba(255,255,255,0.5)'
            }}>
                {frame < durationInFrames - 30 ?
                    "❤️ 点赞 ❤️" :
                    <span style={{
                        background: 'linear-gradient(45deg, #FF3355, #3366FF)',
                        WebkitBackgroundClip: 'text',
                        color: '#fff',
                        fontSize: '1.2em',
                        display: 'inline-block',
                        transform: 'scale(1.1)',
                        animation: 'heartbeat 1.5s infinite' // 添加心跳动画效果
                    }}>选择立场</span>}
            </div>

            {/* 替换原有的互动按钮组，添加左右支持票数显示 */}
            <div style={{
                position: 'absolute',
                left: 24,
                bottom: 420,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                alignItems: 'center',
                zIndex: 100000,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(255, 51, 85, 0.2)',
                    padding: '8px 16px',
                    borderRadius: 20,
                    backdropFilter: 'blur(8px)',
                    border: '2px solid rgba(255, 51, 85, 0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}>
                    <span style={{
                        fontSize: 56,
                        animation: 'heartbeat 1.5s infinite',
                    }}>❤️</span>
                    <span style={{
                        color: '#fff',
                        fontSize: 56,
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}>{formatVotes(leftVotes)}</span>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                right: 24,
                bottom: 420,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                alignItems: 'center',
                zIndex: 100000,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(51, 102, 255, 0.2)',
                    padding: '8px 16px',
                    borderRadius: 20,
                    backdropFilter: 'blur(8px)',
                    border: '2px solid rgba(51, 102, 255, 0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}>
                    <span style={{
                        fontSize: 56,
                        animation: 'heartbeat 1.5s infinite',
                    }}>❤️</span>
                    <span style={{
                        color: '#fff',
                        fontSize: 56,
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}>{formatVotes(rightVotes)}</span>
                </div>
            </div>

           
        </AbsoluteFill>
    );
}; 