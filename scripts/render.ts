import { bundle } from '@remotion/bundler';
import { renderMedia } from '@remotion/renderer';
import path from 'path';

const main = async () => {
  const bundled = await bundle({
    entryPoint: path.resolve('src/Video.tsx'),
    webpackOverride: (config) => config,
  });

  await renderMedia({
    composition: {
      id: 'DebateVideo',
      height: 1920,
      width: 1080,
      fps: 30,
      durationInFrames: 450,
      defaultProps: {},
      defaultCodec: 'h264',
      props: {
        debateData: require('../src/constants').DEBATE_DATA,
      },
    },
    codec: 'h264',
    outputLocation: `out/debate-${Date.now()}.mp4`,
    serveUrl: bundled,
  });
};

main().catch(console.error); 