
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import PhysicsLab from "./pages/PhysicsLab";
import BiologyLab from "./pages/BiologyLab";
import ChemistryLab from "./pages/ChemistryLab";
import NewtonRingsLab from "./pages/NewtonRingsLab";
import TorsionalPendulumLab from "./pages/TorsionalPendulumLab";
import SonometerLab from "./pages/SonometerLab";
import BHCurveLab from "./pages/BHCurveLab";
import TutorPage from "./pages/TutorPage";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="learnscape-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/physics" element={<PhysicsLab />} />
            <Route path="/physics/newtons-rings" element={<NewtonRingsLab />} />
            <Route path="/physics/torsional-pendulum" element={<TorsionalPendulumLab />} />
            <Route path="/physics/sonometer" element={<SonometerLab />} />
            <Route path="/physics/bh-curve" element={<BHCurveLab />} />
            <Route path="/biology" element={<BiologyLab />} />
            <Route path="/chemistry" element={<ChemistryLab />} />
            <Route path="/tutor" element={<TutorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
