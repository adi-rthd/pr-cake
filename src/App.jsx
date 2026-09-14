import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CakeProvider } from './context/CakeContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';
import { ReviewProvider } from './context/ReviewContext';
import { BuilderProvider } from './context/BuilderContext';
import Storefront from './pages/Storefront/Storefront';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import LanguageModal from './components/LanguageModal';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }
  return children;
};

function App() {
  return (
    <LanguageProvider>
      <ReviewProvider>
        <ToastProvider>
          <SettingsProvider>
            <AuthProvider>
              <CakeProvider>
                <BuilderProvider>
                <CartProvider>
                  <LanguageModal />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Storefront />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </BrowserRouter>
              </CartProvider>
              </BuilderProvider>
            </CakeProvider>
          </AuthProvider>
        </SettingsProvider>
      </ToastProvider>
      </ReviewProvider>
    </LanguageProvider>
  );
}

export default App;
