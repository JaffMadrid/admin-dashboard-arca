import { Route, Routes, Navigate} from "react-router-dom";
import { useState, useEffect } from "react";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import Sidebar from "./components/Sidebar";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/Settingspage";
import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChangePasswordPage from "./pages/ChangePasswordPage";


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const checkAuthenticated = async () => {
    try {
      const res = await fetch("https://admin-dashboard-arca-backend.vercel.app/authentication/verify", {
        method: "GET",
        headers: { jwtToken: localStorage.getItem("token") }
      });

      const parseRes = await res.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);


  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
    if (boolean) {
      localStorage.setItem("token", localStorage.getItem("token"));
    } else {
      localStorage.removeItem("token");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>  
      
      {isAuthenticated && !location.pathname.includes('login') && (
        <Sidebar setAuth={setAuth} />
      )}

      <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Slide}
      />

      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      
        <Route path="/login" element={
          <LoginPage setAuth={setAuth} />
          } />

        <Route 
            path="/resetpassword" 
            element={<ResetPassword />} 
          />
        <Route path="/change-password/:token" element={<ChangePasswordPage />} />
        <Route
          path="/overview"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <OverviewPage setAuth={setAuth}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductsPage setAuth={setAuth}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UsersPage setAuth={setAuth}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SalesPage setAuth={setAuth}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <OrdersPage setAuth={setAuth}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SettingsPage setAuth={setAuth}/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
