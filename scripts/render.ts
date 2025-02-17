import { bundle } from '@remotion/bundler';
import { renderMedia } from '@remotion/renderer';
import path from 'path';

// 生成唯一的渲染ID
function generateRandomId() {
  const now = Date.now();
  const randomPart = Math.floor(Math.random() * 1000000);
  return `${now}-${randomPart}`;
}

export default async function renderVideo(debateData: any) {
  console.log('renderVideo:', debateData)
  const bundled = await bundle({
    entryPoint: path.resolve('src/index.ts'),
    webpackOverride: (config) => config,
  });

  const renderId = generateRandomId();
  const outputFileName = `debate-${renderId}.mp4`;
  const outputPath = `out/${outputFileName}`;

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
        debateData,
      },
    },
    codec: 'h264',
    outputLocation: outputPath,
    serveUrl: bundled,
    onProgress: (progress) => {
      console.log('渲染进度:', progress);
      // 这里可以添加进度保存逻辑
    }
  });

  return outputFileName;
} 