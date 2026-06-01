import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] opacity-80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37] opacity-[0.03] rounded-full blur-[100px]" />
        </div>
        
        <div className="z-10 flex flex-col items-center">
          <div className="relative w-16 h-16 flex items-center justify-center mb-6">
            <div className="absolute inset-0 border-t-2 border-[#d4af37] border-r-2 border-transparent rounded-full animate-spin [animation-duration:1.5s]" />
            <div className="absolute inset-2 border-b-2 border-white/50 border-l-2 border-transparent rounded-full animate-spin [animation-duration:2s] [animation-direction:reverse]" />
            <div className="w-6 h-6 border-2 border-[#d4af37] rotate-45 rounded-sm" />
          </div>
          
          <div className="h-4 w-32 bg-white/5 rounded-md overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
