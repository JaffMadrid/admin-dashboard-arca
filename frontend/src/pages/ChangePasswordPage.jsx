import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KeyIcon } from "lucide-react";
import { motion } from "framer-motion";

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return toast.error("Las contraseñas no coinciden");
    }

    try {
      const response = await fetch("admin-dashboard-arca-backend.vercel.app/authentication/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Contraseña actualizada exitosamente");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Error al conectar con el servidor");
    }
  };

  return (
    <div className="flex-1 z-10 flex items-center justify-center h-screen bg-gray-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-center mb-6">
          <KeyIcon size={32} className="text-indigo-500" />
          <h1 className="text-2xl font-semibold ml-2">Nueva Contraseña</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-400">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-700 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-400">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-700 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
          >
            Cambiar Contraseña
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChangePasswordPage;