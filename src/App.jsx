import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Book from "./components/Book.jsx";
import Header from "./components/Header";
import Login from "./components/Login.jsx";
import Order from "./components/Order.jsx";
import Profile from "./components/Profile.jsx";
import Register from "./components/Register.jsx";
import { useAuth } from "./context/AuthContext";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated,isAdmin } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
          {isAuthenticated && <Header />}
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Index />} />
                <Route path="/book" element={<Book />} />
                <Route path="/order" element={<Order />} />
                <Route path="/profile" element={<Profile />} />
                  {isAdmin && (
                    <Route path="/admin" element={<AdminDashboard />} />
                  )}
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/404" element={<NotFound />} />
              </>
            )}
          </Routes>
          {/* Admin navigation link
          {isAuthenticated && isAdmin && (
            <div className="w-full flex justify-center items-center py-2 bg-gray-800">
              <a href="/admin" className="text-blue-400 font-bold">Go to Admin Dashboard</a>
            </div>
          )} */}
          <div className="w-full bg-gray-900 flex justify-center items-center py-6">
            <a href='https://www.linkedin.com/in/om-kadu-53305425a/' target='_blank'><span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold text-sm">
              Made with love <span style={{ color: 'red' }}>❤️</span> by OK
            </span></a>
          </div>
          <ToastContainer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;