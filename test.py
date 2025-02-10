import numpy as np
import scipy.io.wavfile as wavfile

# 音频参数
duration = 1.0       # 音频时长，单位秒
frequency = 440.0    # 音调频率，单位 Hz (A4 音符)
sampling_rate = 44100  # 采样率，单位 Hz (CD 音质)
amplitude = 0.5      # 音频幅度 (0.0 到 1.0)

# 生成时间轴
time = np.linspace(0., duration, int(sampling_rate * duration), endpoint=False)

# 生成正弦波信号
signal = amplitude * np.sin(2 * np.pi * frequency * time)

# 将信号转换为 16-bit 整数格式 (WAV 文件的常用格式)
scaled_signal = np.int16(signal * 32767)

# 保存为 WAV 文件
wavfile.write("output_sound.wav", sampling_rate, scaled_signal)

print("音效文件 'output_sound.wav' 创建成功！")