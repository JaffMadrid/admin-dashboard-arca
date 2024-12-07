import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogIn, User, Lock } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    user: "",
    password: ""
  });

  const navigate = useNavigate();
  const { user, password } = inputs;

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { user, password };
      const response = await fetch("https://admin-dashboard-arca-backend.vercel.app/authentication/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        localStorage.setItem("userRole", parseRes.userRole);
        setAuth(true);
        toast.success("Inicio de Sesion Exitoso");
        navigate("/overview");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
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
          <LogIn size={32} className="text-indigo-500" />
          <h1 className="text-2xl font-semibold ml-2">Iniciar Sesión</h1>
        </div>
        <form onSubmit={onSubmitForm} className="space-y-6">
          <div>
            <label htmlFor="user" className="text-sm font-medium text-gray-400">
              Usuario
            </label>
            <div className="flex items-center relative mt-1 bg-gray-700 rounded-md">
              <User size={20} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                name="user"
                value={user}
                onChange={onChange}
                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-400">
              Contraseña
            </label>
            <div className="flex items-center relative mt-1 bg-gray-700 rounded-md">
              <Lock size={20} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ingresa tu contraseña"
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
            Iniciar Sesión
          </motion.button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Olvidaste tu contraseña?{" "}
          <Link to="/resetpassword" className="text-indigo-400 hover:underline">
          Recuperarla
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
