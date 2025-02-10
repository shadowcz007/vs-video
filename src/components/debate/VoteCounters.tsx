import React from 'react';

interface VoteCountersProps {
    leftVotes: number;
    rightVotes: number;
    formatVotes: (num: number) => string;
}

// 创建通用的计数器样式
const commonCounterStyle:any = {
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

// 创建左右计数器的特定样式
const getCounterStyle = (color: string, top: number = 100) => ({
    ...commonCounterStyle,
    color,
    background: `${color}1a`, // 10% 透明度
    border: `1px solid ${color}4d`, // 30% 透明度
    textShadow: `0 2px 10px ${color}80`, // 50% 透明度
    position: 'absolute',
    top, 
    zIndex: 100000
});

export const VoteCounters: React.FC<VoteCountersProps> = ({
    leftVotes,
    rightVotes,
    formatVotes
}) => {
    return (
        <div style={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 100px'
        }}>
            <div style={getCounterStyle('rgb(255 111 94)',60)}>
                {formatVotes(leftVotes)}
            </div>
            <div style={{
                ...getCounterStyle('rgb(60 229 255)',0),
                left:600,
                bottom:80,
                top:'auto',
                height:'fit-content'
            }}>
                {formatVotes(rightVotes)}
            </div>
        </div>
    );
}; 