
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Cronograma from "./pages/Cronograma";
import Materias from "./pages/Materias";
import Flashcards from "./pages/Flashcards";
import NotFound from "./pages/NotFound";
import { queryClient } from "./lib/queryClient";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/auth" component={Auth} />
          <Route path="/dashboard">
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          </Route>
          <Route path="/cronograma">
            <ProtectedRoute>
              <Layout><Cronograma /></Layout>
            </ProtectedRoute>
          </Route>
          <Route path="/materias">
            <ProtectedRoute>
              <Layout><Materias /></Layout>
            </ProtectedRoute>
          </Route>
          <Route path="/flashcards">
            <ProtectedRoute>
              <Layout><Flashcards /></Layout>
            </ProtectedRoute>
          </Route>
          <Route path="/relatorios">
            <ProtectedRoute>
              <Layout><div>Relatórios em desenvolvimento</div></Layout>
            </ProtectedRoute>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
