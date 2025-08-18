import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface UseNavigationReturn {
  goBack: () => void;
  canGoBack: boolean;
  previousPath: string | null;
}

export function useNavigation(): UseNavigationReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  useEffect(() => {
    // Store navigation history
    setNavigationHistory(prev => {
      const newHistory = [...prev];
      
      // Don't duplicate the same path
      if (newHistory[newHistory.length - 1] !== location.pathname) {
        newHistory.push(location.pathname);
        
        // Keep only last 10 entries to prevent memory issues
        if (newHistory.length > 10) {
          newHistory.shift();
        }
      }
      
      return newHistory;
    });

    // Update previous path
    setPreviousPath(prev => {
      if (prev !== location.pathname) {
        return prev;
      }
      return null;
    });
  }, [location.pathname]);

  const goBack = () => {
    if (navigationHistory.length > 1) {
      // Go to the previous page in our history
      const previousPage = navigationHistory[navigationHistory.length - 2];
      if (previousPage && previousPage !== location.pathname) {
        navigate(previousPage);
        return;
      }
    }
    
    // Fallback: try browser back
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Ultimate fallback: go to home
      navigate('/');
    }
  };

  const canGoBack = navigationHistory.length > 1 || window.history.length > 1;

  return {
    goBack,
    canGoBack,
    previousPath
  };
}

export default useNavigation;
