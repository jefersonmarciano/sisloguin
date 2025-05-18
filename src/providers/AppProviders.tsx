import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { EarningsProvider } from "@/contexts/earnings";
import { CommunityProvider } from "@/contexts/CommunityContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <AuthProvider>
              <EarningsProvider>
                <CommunityProvider>
                  {children}
                </CommunityProvider>
              </EarningsProvider>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
} 