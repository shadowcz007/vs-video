import { Config } from '@remotion/cli/config';

Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...(currentConfiguration.module?.rules ?? []),
      ],
    },
  };
});

Config.setVideoImageFormat('jpeg');
Config.setPixelFormat('yuv420p');

// 添加入口文件配置
Config.setEntryPoint('src/index.ts'); 