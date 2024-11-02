import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

const ProductsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredMaterials, setFilteredMaterials] = useState([]);
	const [materialsData, setMaterialsData] = useState([]);

  // Función para obtener los datos de materiales de la API
  const fetchMaterials = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/materiales"); // Ajusta la URL según tu ruta API
      const data = await res.json();
      setMaterialsData(data);
      setFilteredMaterials(data);
    } catch (error) {
      console.error("Error al obtener datos de materiales:", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = materialsData.filter(
      (material) =>
        material.descripcion_tipo.toLowerCase().includes(term) ||
        material.nombre_donante.toLowerCase().includes(term) ||
        material.descripcion_estado.toLowerCase().includes(term)
    );
    setFilteredMaterials(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Inventario de Materiales Reciclables</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar Materiales..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Peso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha Ingreso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Donante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredMaterials.map((material) => (
              <motion.tr
                key={material.id_material}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{material.descripcion_tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{material.peso}lb</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(material.fecha_ingreso).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{material.nombre_donante}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{material.descripcion_estado}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductsTable;
