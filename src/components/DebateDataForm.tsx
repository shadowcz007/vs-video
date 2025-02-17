import React, { useState, useCallback, useEffect } from 'react';
import { staticFile } from "remotion";
interface DebateFormData {
  title: string;
  left: string[];
  right: string[];
  centerImage?: string;
}

interface DebateDataFormProps {
  onDataChange?: (data: any) => void;
  initialData?: DebateFormData;
  totalCount?: number;
  currentIndex?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onNew?: () => void;
}

export const DebateDataForm: React.FC<DebateDataFormProps> = ({
  onDataChange,
  initialData,
  totalCount = 0,
  currentIndex = 0,
  onPrev,
  onNext,
  onNew
}) => {
  const [formData, setFormData] = useState<DebateFormData>(() => {
    return {
      title: initialData?.title || '',
      left: initialData?.left || ['', '', ''],
      right: initialData?.right || ['', '', ''],
      centerImage: initialData?.centerImage
    };
  });

  // 添加 useEffect 来监听 initialData 的变化
  useEffect(() => {
    setFormData({
      title: initialData?.title || '',
      left: initialData?.left || ['', '', ''],
      right: initialData?.right || ['', '', ''],
      centerImage: initialData?.centerImage
    });
    console.log('initialData', initialData)
  }, [initialData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onDataChange?.(formData);
  }, [formData, onDataChange]);

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>辩论数据编辑器</h1>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <span style={{ color: '#666' }}>
            {currentIndex === -1 ? '新建数据' : `共 ${totalCount} 条 | 当前第 ${currentIndex + 1} 条`}
          </span>
          <button
            onClick={onPrev}
            disabled={currentIndex <= 0}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: currentIndex <= 0 ? '#ccc' : '#2d5ca8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentIndex <= 0 ? 'not-allowed' : 'pointer'
            }}
          >
            上一条
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === -1 || currentIndex === totalCount - 1}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: currentIndex === -1 || currentIndex === totalCount - 1 ? '#ccc' : '#2d5ca8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentIndex === -1 || currentIndex === totalCount - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            下一条
          </button>
          <button
            onClick={onNew}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            新建
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>标题：</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            maxLength={15}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>中心图片：</label>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div
              style={{
                width: '200px',
                height: '200px',
                border: '2px dashed #ddd',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => document.getElementById('imageUpload')?.click()}
            >
              {formData.centerImage ? (
                <img
                  src={formData.centerImage.startsWith('data:') 
                    ? formData.centerImage 
                    : staticFile(formData.centerImage)}
                  alt="中心图片"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#666'
                }}>
                  <div>点击上传图片</div>
                  <div style={{ fontSize: '12px' }}>支持 jpg、png 格式</div>
                </div>
              )}
            </div>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({
                      ...formData,
                      centerImage: reader.result as string
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#2d5ca8' }}>左方论点</h3>
            {formData.left.map((point, index) => (
              <input
                key={`left-${index}`}
                type="text"
                value={point}
                onChange={(e) => {
                  const newLeft = [...formData.left];
                  newLeft[index] = e.target.value;
                  setFormData({ ...formData, left: newLeft });
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  fontSize: '16px',
                  border: '1px solid #2d5ca8',
                  borderRadius: '4px'
                }}
                maxLength={10}
              />
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#c93434' }}>右方论点</h3>
            {formData.right.map((point, index) => (
              <input
                key={`right-${index}`}
                type="text"
                value={point}
                onChange={(e) => {
                  const newRight = [...formData.right];
                  newRight[index] = e.target.value;
                  setFormData({ ...formData, right: newRight });
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  fontSize: '16px',
                  border: '1px solid #c93434',
                  borderRadius: '4px'
                }}
                maxLength={10}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          生成数据
        </button>
      </form>
    </div>
  );
};
