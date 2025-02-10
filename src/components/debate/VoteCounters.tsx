import React from 'react';

interface VoteCountersProps {
    leftVotes: number;
    rightVotes: number;
    formatVotes: (num: number) => string;
}

export const VoteCounters: React.FC<VoteCountersProps> = ({
    leftVotes,
    rightVotes,
    formatVotes
}) => {
    return (
        <div style={{
            position: 'absolute',
            bottom: 300,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 100px',
            zIndex: 100000
        }}>
            <div style={{
                color: '#FF3355',
                fontSize: 48,
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: 12,
                background: 'rgba(255,51,85,0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,51,85,0.3)',
                textShadow: '0 2px 10px rgba(255,51,85,0.5)',
                transition: 'all 0.3s ease',
            }}>
                {formatVotes(leftVotes)}
            </div>
            <div style={{
                color: '#3366FF',
                fontSize: 48,
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: 12,
                background: 'rgba(51,102,255,0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(51,102,255,0.3)',
                textShadow: '0 2px 10px rgba(51,102,255,0.5)',
                transition: 'all 0.3s ease',
            }}>
                {formatVotes(rightVotes)}
            </div>
        </div>
    );
}; 