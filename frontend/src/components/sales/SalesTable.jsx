import { motion } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";


const SalesTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [materialsData, setMaterialsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
    const [rowsPerPage, setRowsPerPage] = useState(10); // Número máximo de filas por página
  
  
    useEffect(() => {
      // Función para obtener los datos de materiales de la API
      const fetchMaterials = async () => {
        try {
          const res = await fetch("http://localhost:5000/dashboard//materialesForSale"); // Ajusta la URL según tu ruta API
          const data = await res.json();
          setMaterialsData(data);
          setFilteredMaterials(data);
        } catch (error) {
          console.error("Error al obtener datos de materiales:", error);
        }
      };
      fetchMaterials();
    }, []);
  
    // Función para manejar la búsqueda
    const handleSearch = (e) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);
      const filtered = materialsData.filter(
        (material) =>
          material.descripcion_tipo.toLowerCase().includes(term) 
      );
      setFilteredMaterials(filtered);
      setCurrentPage(1);
    };
  
      // Calcular datos a mostrar en la página actual
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredMaterials.slice(indexOfFirstRow, indexOfLastRow);
  
    // Manejar cambio de página
    const handlePageChange = (newPage) => setCurrentPage(newPage);
  
    // Manejar cambio de cantidad de filas por página
    const handleRowsPerPageChange = (e) => {
      setRowsPerPage(parseInt(e.target.value));
      setCurrentPage(1); // Reiniciar a la primera página
    };
  
  
    return (
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Venta de Materiales
          </h2>
          <div className="flex items-center relative">
            <input
              type="text"
              placeholder="Buscar Materiales..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <button
              className="ml-4 text-green-400 hover:text-green-300"
            >
              <ShoppingCart size={24} />
            </button>
          </div>
        </div>
  
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Peso Total(lb)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentRows.map((material) => (
                <motion.tr
                  key={material.id_material}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {material.descripcion_tipo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {material.peso_total} lb
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Controles de paginación */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <label className="text-gray-400 mr-2 text-xs">Filas por página:</label>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="bg-gray-700 text-white px-3 text-xs py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-gray-400 text-xs hover:text-gray-300 px-3 py-2"
            >
              Anterior
            </button>
            <span className="text-gray-400 mx-2 text-xs">
              Página {currentPage} de {Math.ceil(filteredMaterials.length / rowsPerPage)}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredMaterials.length / rowsPerPage)}
              className="text-gray-400 text-xs hover:text-gray-300 px-3 py-2"
            >
              Siguiente
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
  export default SalesTable;