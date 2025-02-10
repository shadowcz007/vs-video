import { Composition } from 'remotion';
import { MyVideo } from './Video';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DebateVideo"
      component={MyVideo}
      durationInFrames={210} // 7秒*30fps
      fps={30}
      width={1080}
      height={1920} // 竖屏格式
    />
  );
}; 