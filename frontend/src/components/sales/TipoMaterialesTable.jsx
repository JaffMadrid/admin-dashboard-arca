import { motion } from "framer-motion";
import { Search, Edit, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [tipoMateriales, setTipoMateriales] = useState([]);
  const [editMaterial, setEditMaterial] = useState(null); // Estado para el material en edición
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal de edición
  const [newTipoMaterial, setNewTipoMaterial] = useState({
    descripcion_tipo: "",
    preciolibra: "",
  });
  const [createModalOpen, setCreateModalOpen] = useState(false); // Estado para el modal de creación
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Número máximo de filas por página


  useEffect(() => {
    const fetchTipoMateriales = async () => {
      try {
        const res = await fetch(
          "https://admin-dashboard-arca-backend.vercel.app/dashboard/tipoMateriales",
          { method: "GET" }
        );
        const data = await res.json();
        setTipoMateriales(data); 
        setFilteredMaterials(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchTipoMateriales();
  }, []);

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = tipoMateriales.filter(
      (material) =>
        material.descripcion_tipo.toLowerCase().includes(term) 
    );
    setFilteredMaterials(filtered);
	setCurrentPage(1);
  };

  const handleEditClick = (material) => {
    setEditMaterial(material); // Set material to edit
    setModalOpen(true); // Open modal
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditMaterial(null); // Reset the user being edited
  };

  const handleMaterialUpdate = async (updatedTipoMaterial) => {
    try {
      const res = await fetch(
        `https://admin-dashboard-arca-backend.vercel.app/dashboard/updateTipo/${updatedTipoMaterial.id_tipo_material}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            jwtToken: localStorage.token,
          },
          body: JSON.stringify(updatedTipoMaterial),
        }
      );
      const data = await res.json();

      if (res.ok) {

        const updatedData = data.tipo;

      // Actualizar estado de tipoMateriales
      setTipoMateriales((prev) =>
        prev.map((tipo) =>
          tipo.id_tipo_material === updatedData.id_tipo_material
            ? { ...tipo, ...updatedData } // Actualiza solo el material correspondiente
            : tipo
        )
      );

      // Actualizar estado de filteredMaterials
      setFilteredMaterials((prev) =>
        prev.map((tipo) =>
          tipo.id_tipo_material === updatedData.id_tipo_material
            ? { ...tipo, ...updatedData } // Actualiza solo el material correspondiente
            : tipo
        )
      );
        handleModalClose(); // Close modal after updating
        toast.success("Tipo Material editado con exito!");
      } else {
        console.error("Error updating Tipo Material:", data.message);
        toast.error("Error al editar Tipo Material");
      }
    } catch (error) {
      console.error("Error updating Tipo Material:", error);
      toast.error("Error al editar Tipo Material");
    }
  };

  // Abrir modal de creación de material
  const handleCreateClick = () => setCreateModalOpen(true);

  // Cerrar modal de creación de material
  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setNewTipoMaterial({
        descripcion_tipo: "",
        precioLibra: "",
    });
  };

  // Crear nuevo material en la base de datos
  const handleTipoMaterialCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://admin-dashboard-arca-backend.vercel.app/dashboard/createTipoMaterial",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            jwtToken: localStorage.token,
          },
          body: JSON.stringify(newTipoMaterial),
        }
      );
      if (res.ok) {
        const data = await res.json();

        setTipoMateriales([...tipoMateriales, data]);
        setFilteredMaterials([...filteredMaterials, data]);
        handleCreateModalClose(); // Cerrar modal después de crear
        toast.success("Tipo Material Creado con Exito!");
      } else {
        const errorData = await res.json();
        console.error("Error creating Tipo Material:", errorData.message);
        toast.error("Error al crear Tipo Material");
      }
    } catch (error) {
      console.error("Error creating Tipo Material:", error);
      toast.error("Error al crear Tipo Material");
    }
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
          Tipos de Materiales
        </h2>
        <div className="flex items-center relative">
          <input
            type="text"
            placeholder="Buscar Tipos..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <button
            className="ml-4 text-green-400 hover:text-green-300"
            onClick={handleCreateClick}
          >
            <PlusCircle size={24} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tipo Material
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Precio por Libra (L.)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
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
                  L. {material.preciolibra} 
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleEditClick(material)}
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
			
      {/* Modal de edición */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 w-96">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Editar Tipo Material
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleMaterialUpdate(editMaterial); // Actualiza el Tipo Material
              }}
            >
              <div className="mb-3">
                <label className="block mb-1 text-gray-300">Tipo Material: </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editMaterial?.descripcion_tipo || ""}
                  onChange={(e) =>
                    setEditMaterial({ ...editMaterial, descripcion_tipo: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-gray-300">Precio por Libra (L.)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editMaterial?.preciolibra || ""}
                  onChange={(e) =>
                    setEditMaterial({ ...editMaterial, preciolibra: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                  onClick={handleModalClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
	  {/* Modal de Creacion */}
      {createModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 w-96">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Agregar Tipo Material
            </h2>
            <form onSubmit={handleTipoMaterialCreate}>
            <div className="mb-3">
                <label className="block mb-1 text-gray-300">Tipo Material:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newTipoMaterial.descripcion_tipo}
                  onChange={(e) =>
                    setNewTipoMaterial({ ...newTipoMaterial, descripcion_tipo: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-gray-300">Precio por Libra (L.):</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newTipoMaterial.preciolibra}
                  onChange={(e) =>
                    setNewTipoMaterial({ ...newTipoMaterial, preciolibra: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-red-600 px-4 py-2 rounded text-white"
                  onClick={handleCreateModalClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 px-4 py-2 rounded text-white"
                >
                  Agregar Tipo Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

	  {/* Controles de paginación */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label className="text-gray-400 mr-2 text-xs">Filas por página:</label>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
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
            className="text-gray-400 hover:text-gray-300 px-3 py-2 text-xs"
          >
            <ChevronLeft/>
          </button>
          <span className="text-gray-400 mx-2 text-xs">
            Página {currentPage} de {Math.ceil(filteredMaterials.length / rowsPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredMaterials.length / rowsPerPage)}
            className="text-gray-400 hover:text-gray-300 px-3 py-2 text-xs"
          >
            <ChevronRight/>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsTable;
