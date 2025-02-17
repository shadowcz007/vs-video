import React, { createContext, useContext, useState } from 'react';

interface DebateData {
  title: string;
  left: string[];
  right: string[];
}

interface DebateContextType {
  debateData: DebateData;
  setDebateData: (data: DebateData) => void;
}

const DebateContext = createContext<DebateContextType | undefined>(undefined);

export const DebateProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [debateData, setDebateData] = useState({
    title: "知识工作重塑与人机协同的未来",
    left: [
      "增强智能 成为新标准",
      "知识生产从 线性 到 网络化",
      "创造性任务 回归人类核心价值"
    ],
    right: [
      "认知过载 信息焦虑",
      "技能快速迭代 持续学习压力",
      "人机伦理边界 身份认同危机"
    ]
  });

  return (
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