import { AbsoluteFill } from 'remotion';
import { DebateScene } from './components/DebateScene';
import { loadFont } from "@remotion/google-fonts/Inter";

loadFont();

export const MyVideo: React.FC = () => {
  return (
    <div style={{ flex: 1, backgroundColor: "black" }}>
      <DebateScene />
    </div>
  );
}; 