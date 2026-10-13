import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import Header from './components/HeaderMenu';
import Footer from './components/Footer';
import ScrollEffects from './components/ScrollEffects';
import { SiteData } from './SiteData';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import Seo from './components/Seo';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <SiteData>
      <Seo />
      <ScrollToTop />
      <ScrollEffects />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/new" element={<AdminPage />} />
            <Route path="/setup" element={<Navigate to="/profile" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </SiteData>
    </Router>
  );
}

export default App;
