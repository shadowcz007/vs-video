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

 