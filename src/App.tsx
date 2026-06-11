import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './hooks/useApp';
import Layout from './components/layout/Layout';
import BoardPage from './pages/Board';
import DashboardPage from './pages/Dashboard';
import StatisticsPage from './pages/Statistics';
import './styles/globals.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<BoardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
