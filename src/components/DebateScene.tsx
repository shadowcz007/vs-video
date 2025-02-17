import { AbsoluteFill, useCurrentFrame, Audio, staticFile, Sequence, useVideoConfig } from "remotion";
import { DEBATE_DATA } from '../constants';
import React from 'react';
import { Background } from './debate/Background';
import { VoteCounters } from './debate/VoteCounters';
import { DebatePoints } from './debate/DebatePoints';
import { SplitterEffect } from './SplitterEffect';
import { TeamIcons } from './debate/TeamIcons';

import { VsBackground } from './debate/VsBackground';
 
interface DebateSceneProps {
  debateData: any;
}

export const DebateScene: React.FC<DebateSceneProps> = ({ debateData }) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
    let audio1 = staticFile("/a1.MP3")
    let audio2 = staticFile("/a2.MP3")
    let music = staticFile("/music.mp3")

    // 确保左右两边数据长度一致，并使用总时长来计算每组数据的显示时间
    if (debateData.left.length !== debateData.right.length) {
        console.warn('左右辩论数据长度不一致！');
    }
    const ITEM_DURATION = durationInFrames / debateData.left.length;

    const textIndex = Math.floor(frame / ITEM_DURATION);

    // 计算是否应该显示
    const shouldShowSplitterEffect = frame >= fps * 1.2;
    const shouldShowDebatePoints = frame >= fps * 0.7;

    const toggleText = Array.from(new Array(3), (_, index) => {
        return (index * ITEM_DURATION + (index == 0 ? fps * 0.7 : 0))
    })

    return (
        <AbsoluteFill>
            <VsBackground />
            <Background />

            {shouldShowSplitterEffect && <SplitterEffect />}
            {shouldShowDebatePoints && <DebatePoints
                alignedDebateData={debateData}
                textIndex={textIndex}
                frame={frame}
                fps={fps}
                toggleText={toggleText}
            />}
            <span style={{
                position: 'absolute',
                top: 180,
                left: 0,
                color: 'white',
                fontSize: 72,
                fontWeight: 800,
                width: '100%',
                height: 200,
                backgroundColor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {debateData.title}
            </span>
            <TeamIcons />

            <Sequence from={8}>
                <Audio src={audio1} />
            </Sequence>
            {toggleText.map((a) => (
                <Sequence from={a}>
                    <Audio src={audio2} />
                </Sequence>
            ))}
            <Audio
                src={music}
                startFrom={0}
            />
        </AbsoluteFill>
    );
}; 