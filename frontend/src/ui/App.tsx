import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BuilderPage from './builder/BuilderPage';
import AdminApp from './admin/AdminApp';
import FeedbackPage from './FeedbackPage';
import PrivacyPage from './PrivacyPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BuilderPage />} />
          <Route path="/feedback/:orderId" element={<FeedbackPage />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/login" element={<Navigate to="/admin" replace />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
