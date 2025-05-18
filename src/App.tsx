
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./routes";
import { useAuth } from "./contexts/AuthContext";
import { useDailyReset } from "./hooks/user-profile/useDailyReset";
import { useEffect } from "react";

// Componente separado para usar hooks que dependem do AuthProvider
function AuthenticatedContent() {
  const { user } = useAuth();

  // Usa o hook de reset diário apenas quando o usuário estiver autenticado
  useDailyReset();

  useEffect(() => {
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
    };
  }, []);

  return (
    <>
      <Toaster />
      <Sonner />
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <AppProviders>
      <AuthenticatedContent />
    </AppProviders>
  );
}

function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWrapper;
