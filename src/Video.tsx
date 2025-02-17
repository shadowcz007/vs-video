import { AbsoluteFill } from 'remotion';
import { DebateScene } from './components/DebateScene';
import { loadFont } from "@remotion/google-fonts/Inter";
import { DebateData } from './types/debate';

interface VideoProps {
  debateData: DebateData;
}

loadFont();

export const MyVideo: React.FC<VideoProps> = ({ debateData }) => {
  return (
    <div style={{ flex: 1, backgroundColor: "black" }}>
      <DebateScene debateData={debateData} />
    </div>
  );
}; 