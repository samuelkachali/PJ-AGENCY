import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import PublicList from './pages/PublicList';
import AdvertDetails from './pages/AdvertDetails.jsx';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewAdvert from './pages/NewAdvert';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Main application router
export default function App() {
  return (
    <BrowserRouter>
      {/* Fallback global nav for pages without PublicList layout */}
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/adverts" element={<PublicList />} />
        <Route path="/adverts/:id" element={<AdvertDetails />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/new"
          element={
            <PrivateRoute>
              <NewAdvert />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}