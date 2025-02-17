import React, { createContext, useContext, useState } from 'react';
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
  const [debateData, setDebateData] = useState(() => {
    const savedData = loadDebateData();
    return savedData || DEBATE_DATA;
  });

  return (
    // @ts-ignore
    <DebateContext.Provider value={{ debateData, setDebateData }}>
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