import React from 'react';
import { Player } from '@remotion/player';
import { MyVideo } from '../Video';
import { DebateDataForm } from './DebateDataForm';
import { useDebateData } from '../contexts/DebateContext';
import { saveDebateData } from '../utils/fileUtils';
import { renderVideo } from '../utils/renderVideo';
import axios from 'axios';

export const Layout: React.FC = () => {
  const { debateData, setDebateData } = useDebateData();

  const handleDataChange = async (data: any) => {
    if (data) {
      setDebateData(data);
      // 保存到 JSON 文件
      if (await saveDebateData(data)) {
        alert('数据已更新并保存！');
      } else {
        alert('数据已更新，但保存失败！');
      }
    }
  };

  const handleExportVideo = async () => {
    try {
      const response = await axios.post('/api/render', { debateId: debateData.id });
      alert(`视频正在渲染，完成后可访问：${response.data.videoUrl}`);
    } catch (error) {
      alert('视频渲染失败');
    }
  };

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'white'
    }}>
      {/* 左侧编辑器 */}
      <div style={{
        flex: 1,
        padding: '20px',
        borderRight: '1px solid #333'
      }}>
        <DebateDataForm onDataChange={handleDataChange} />
        <button
          onClick={handleExportVideo}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          导出视频
        </button>
      </div>
      
      {/* 右侧预览 */}
      <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>预览</h2>
        <div style={{ width: '360px', height: '640px', overflow: 'hidden' }}>
          <Player
            component={MyVideo}
            durationInFrames={450}
            fps={30}
            compositionWidth={1080}
            compositionHeight={1920}
            style={{
              width: '100%',
              height: '100%',
            }}
            controls={true}
            inputProps={{
              debateData
            }}
          />
        </div>
      </div>
    </div>
  );
};
