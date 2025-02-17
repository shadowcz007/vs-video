import axios from 'axios';

const STORAGE_KEY = 'debate-data';

export const saveDebateData = async (data: any) => {
  try {
    const response = await axios.post('/api/debates', data);
    return response.data;
  } catch (error) {
    console.error('保存失败:', error);
    return null;
  }
};

export const loadDebateData = async (id?: number) => {
  try {
    const response = await axios.get(id ? `/api/debates/${id}` : '/api/debates/latest');
    return response.data;
  } catch (error) {
    console.error('加载失败:', error);
    return null;
  }
}; 