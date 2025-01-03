import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSessionClient } from '../context/sessionContext';

const ProtectedRoute: FC = () => {
  const { sessionClient } = useSessionClient();
  return sessionClient ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute; 