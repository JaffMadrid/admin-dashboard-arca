import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, KeyIcon } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://admin-dashboard-arca-backend.vercel.app/authentication/reset-password", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const parseRes = await response.json();

      if (response.ok) {
        toast.success("Se ha enviado un correo con instrucciones");
        navigate("/login");
      } else {
        toast.error(parseRes.message || "Error al enviar el correo");
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
          <h1 className="text-2xl font-semibold ml-2">Recuperar Contraseña</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-400">
              Correo Electrónico
            </label>
            <div className="flex items-center mt-1 bg-gray-700 rounded-md">
              <Mail size={20} className="text-gray-400 ml-3" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold text-white transition-all duration-150"
          >
            Enviar Instrucciones
          </motion.button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Recordaste tu contraseña?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
          Inicia Sesion
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;