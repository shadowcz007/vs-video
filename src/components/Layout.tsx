import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { MyVideo } from '../Video';
import { DebateDataForm } from './DebateDataForm';
import { useDebateData } from '../contexts/DebateContext';
import { saveDebateData } from '../utils/fileUtils'; 
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const Layout: React.FC = () => {
  const { debateData, setDebateData } = useDebateData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [allDebates, setAllDebates] = useState<any[]>([]);

  // 获取所有辩论数据
  useEffect(() => {
    const fetchAllDebates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/debates`);
        console.log('response',response)
        if (response.data && Array.isArray(response.data)) {
          setAllDebates(response.data);
          setTotalCount(response.data.length);
          if (response.data.length > 0) {
            setDebateData(response.data[0]);
          }
        }
      } catch (error) {
        console.error('获取辩论数据失败:', error);
        setTotalCount(0);
      }
    };
    fetchAllDebates();
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setDebateData(allDebates[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(prev => prev + 1);
      setDebateData(allDebates[currentIndex + 1]);
    }
  };

  const handleNew = () => {
    // 清空表单数据
    setDebateData({
      title: '',
      left: ['', '', ''],
      right: ['', '', ''],
      centerImage: undefined
    });
    // 重置当前索引为-1，表示正在创建新数据
    setCurrentIndex(-1);
  };

  const handleDataChange = async (data: any) => {
    if (data) {
      try {
        const result = await saveDebateData(data);
        if (result) {
          // 重新获取最新数据
          const response = await axios.get('/api/debates');
          if (response.data && Array.isArray(response.data)) {
            setAllDebates(response.data);
            setTotalCount(response.data.length);
            setCurrentIndex(response.data.length - 1); // 设置为最新添加的数据
            setDebateData(response.data[response.data.length - 1]);
          }
          alert('数据已更新并保存！');
        } else {
          alert('数据保存失败！');
        }
      } catch (error) {
        console.error('保存数据时出错:', error);
        alert('数据保存失败！');
      }
    }
  };
// src/components/Layout.tsx 中的 handleExportVideo 函数
const handleExportVideo = async () => {
  try {
    // 显示开始渲染提示
    const loadingMessage = '视频渲染中，请稍候...';
    alert(loadingMessage);
    
    const response = await axios.post(`${API_BASE_URL}/api/render`, { 
      debateId: debateData.id 
    });
    
    if (response.data.success) {
      alert(`视频渲染成功！可访问：${response.data.videoUrl}`);
    } else {
      throw new Error('渲染失败');
    }
  } catch (error: any) {
    console.error('视频渲染失败:', error);
    alert(`视频渲染失败: ${error.response?.data?.details || error.message}`);
  }
};

  if (!debateData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: 24
      }}>
        正在加载数据...
      </div>
    );
  }

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
        <DebateDataForm 
          onDataChange={handleDataChange}
          initialData={debateData}
          totalCount={totalCount}
          currentIndex={currentIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onNew={handleNew}
        />
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
