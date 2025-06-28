import { useLocation } from 'react-router-dom';

export const usePublicRoute = () => {
  try {
    const location = useLocation();
    const publicRoutes = ['/login', '/signup', '/forgot-password'];
    return publicRoutes.includes(location.pathname);
  } catch (error) {
    // Fallback if useLocation is not available (outside Router context)
    const currentPath = window.location.pathname;
    const publicRoutes = ['/login', '/signup', '/forgot-password'];
    return publicRoutes.includes(currentPath);
  }
};

export const isPublicRoutePath = (pathname: string): boolean => {
  const publicRoutes = ['/login', '/signup', '/forgot-password'];
  return publicRoutes.includes(pathname);
};
