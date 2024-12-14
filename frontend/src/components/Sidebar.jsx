import {
  BarChart2,
  DollarSign,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = ({ setAuth }) => {
  const [isSideBarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();


 
  // Obtener el rol del usuario del almacenamiento local
  const userRole = localStorage.getItem("userRole");

  // Definir los elementos del Sidebar
  const SIDEBAR_ITEMS = [
    { name: "Vista General", icon: BarChart2, color: "#6366f1", href: "/overview", roles: ["1", "2"] },
    { name: "Ingreso de Material", icon: ShoppingBag, color: "#8B5CF6", href: "/products", roles: ["1", "2", "3"] },
    { name: "Venta de Material", icon: DollarSign, color: "#10B981", href: "/sales", roles: ["1", "2"] },
    { name: "Análisis", icon: TrendingUp, color: "#F59E0B", href: "/orders", roles: ["1", "2"] },
    { name: "Usuarios", icon: Users, color: "#EC4899", href: "/users", roles: ["1"] },
    { name: "Perfil", icon: Settings, color: "#6EE7B7", href: "/settings", roles: ["1", "2", "3"] },
    {
      name: "Cerrar Sesión",
      icon: LogOut,
      color: "#b23b3b",
      href: "/login",
      roles: ["1", "2", "3"],
      onClick: () => {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          setAuth(false);
          toast.success("Cierre de Sesión Exitoso");
          navigate("/login");
        } catch (err) {
          console.error(err.message);
        }
      },
    },
  ];

  // Filtrar los elementos del Sidebar según el rol del usuario
  const filteredItems = SIDEBAR_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSideBarOpen ? "w-64" : "w-20"}`}
      animate={{ width: isSideBarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSideBarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>
        <nav className="mt-8 flex-grow">
          {filteredItems.map((item) => (
            <Link key={item.href} to={item.href} onClick={item.onClick || null}>
              <motion.div className="flex item-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                <AnimatePresence>
                  {isSideBarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;