import React from 'react';
import {Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({element, adminOnly}) => {
  const token = Cookies.get('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const isAdmin = decodedToken.isAdmin;

    if (adminOnly && !isAdmin) {
      return <Navigate to="/unauthorized" />;
    }

    return element;
  } catch (error) {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
