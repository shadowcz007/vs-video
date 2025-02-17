import React, { useState, useCallback } from 'react';

interface DebateFormData {
  title: string;
  left: string[];
  right: string[];
}

interface DebateDataFormProps {
  onDataChange?: (data: DebateFormData) => void;
}

export const DebateDataForm: React.FC<DebateDataFormProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState<DebateFormData>({
    title: '',
    left: ['', '', ''],
    right: ['', '', '']
  });

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
      <h1 style={{ color: '#333', marginBottom: '20px' }}>辩论数据编辑器</h1>
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
