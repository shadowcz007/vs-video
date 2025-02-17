import axios from 'axios';
import { API_BASE_URL } from '../config';

export const saveDebateData = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/debates`, data);
   
    return response.data;
  } catch (error) {
    console.error('保存失败:', error);
    return null;
  }
};

export const loadDebateData = async (id?: number) => {
  try {
    const response = await axios.get(
      id ? `${API_BASE_URL}/api/debates/${id}` : `${API_BASE_URL}/api/debates/latest`
    );
    return response.data;
  } catch (error) {
    console.error('加载失败:', error);
    return null;
  }
}; 