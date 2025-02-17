import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { MyVideo } from '../Video';
import { DebateDataForm } from './DebateDataForm';

export const Layout: React.FC = () => {
  const [currentData, setCurrentData] = useState(null);

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1a1a1a'
    }}>
      {/* 左侧编辑器 */}
      <div style={{
        flex: 1,
        padding: '20px',
        borderRight: '1px solid #333'
      }}>
        <DebateDataForm onDataChange={setCurrentData} />
      </div>
      
      {/* 右侧预览 */}
      <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>预览</h2>
        <div style={{ width: '360px', height: '640px' }}>
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
            controls
          />
        </div>
      </div>
    </div>
  );
};
