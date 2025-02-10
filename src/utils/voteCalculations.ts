import { DebateData } from "../types/debate";

export const getRandomVotes = (base: number) => base + Math.floor(Math.random() * 1000);

export const formatVotes = (num: number) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
};

export const preprocessDebateData = (data: DebateData) => {
    const maxLength = Math.max(
        ...data.left.map((text: string) => text.length),
        ...data.right.map((text: string) => text.length)
    );

    const alignedLeft = data.left.map(text => text.padEnd(maxLength, '——'));
    const alignedRight = data.right.map(text => text.padEnd(maxLength, '——'));

    return { left: alignedLeft, right: alignedRight };
}; 