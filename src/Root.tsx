import { Layout } from './components/Layout';
import { DebateProvider } from './contexts/DebateContext';

export const RemotionRoot: React.FC = () => {
  return (
    <DebateProvider>
      <Layout />
    </DebateProvider>
  );
}; 