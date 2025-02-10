export type CompetitionPattern = {
    stages: { time: number; leftRatio: number; rightRatio: number; }[];
    winner: 'left' | 'right';
};

export interface DebateData {
    left: string[];
    right: string[];
}

export interface AlignedDebateData {
    left: string[];
    right: string[];
} 