/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { TransactionsPage } from "./components/Transactions";
import { EntitiesPage } from "./components/Entities";
import { AnalysisPipeline } from "./components/AnalysisPipeline";
import { RecoveryPlan } from "./components/RecoveryPlan";
import { FinancialAnalysis } from "./components/FinancialAnalysis";
import Settings from "./components/Settings";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/entities" element={<EntitiesPage />} />
              <Route path="/analysis" element={<AnalysisPipeline />} />
              <Route path="/recovery-plan" element={<RecoveryPlan />} />
              <Route path="/financial-stats" element={<FinancialAnalysis />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </DashboardLayout>
          <Toaster position="top-right" />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

