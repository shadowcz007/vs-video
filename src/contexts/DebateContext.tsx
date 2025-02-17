import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadDebateData } from '../utils/fileUtils';
import { DEBATE_DATA } from '../constants';

interface DebateData {
  title: string;
  left: string[];
  right: string[];
  centerImage?: any;
  id?: number;
}

interface DebateContextType {
  debateData: DebateData;
  setDebateData: (data: DebateData) => void;
}

const DebateContext = createContext<DebateContextType | undefined>(undefined);

export const DebateProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [debateData, setDebateData] = useState<DebateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await loadDebateData();
        setDebateData(savedData || DEBATE_DATA);
      } catch (error) {
        console.error('加载辩论数据失败:', error);
        setDebateData(DEBATE_DATA);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    // @ts-ignore
    <DebateContext.Provider value={{ 
      debateData: debateData as DebateData, 
      setDebateData 
    }}>
      {children}
    </DebateContext.Provider>
  );
};

export const useDebateData = () => {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error('useDebateData must be used within a DebateProvider');
  }
  return context;
};