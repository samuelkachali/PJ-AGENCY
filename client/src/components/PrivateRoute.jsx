import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../api/client';

export default function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}
