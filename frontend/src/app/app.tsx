import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'
import Login from '../pages/login/login';
import Dashboard from '../pages/dassboard/dassboard';
import MapView from '../pages/mapview/mapview';

const App: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <div>User not logged in</div>}
      />
      <Route
        path="/map/:id"
        element={user ? <MapView /> : <div>User not logged in</div>}
      />
    </Routes>
  );
};

export default App;
