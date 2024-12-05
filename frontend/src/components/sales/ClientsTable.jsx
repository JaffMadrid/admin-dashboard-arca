import { motion } from "framer-motion";
import { Search, Edit, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const DonantesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [editCliente, setEditCliente] = useState(null); // Estado para el donante en edición
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal de edición
  const [newCliente, setNewCliente] = useState({
    nombre_cliente: "",
    telefono_cliente: "",
    direccion_cliente: "",
  });
  const [createModalOpen, setCreateModalOpen] = useState(false); // Estado para el modal de creación
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Número máximo de filas por página

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch(
          "https://admin-dashboard-arca-backend.vercel.app/dashboard/clientes",
          { method: "GET" }
        );
        const data = await res.json();
        setClientes(data); 
        setFilteredClientes(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchClientes();
  }, []);

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nombre_cliente.toLowerCase().includes(term) 
    );
    setFilteredClientes(filtered);
	setCurrentPage(1);
  };

  const handleEditClick = (cliente) => {
    setEditCliente(cliente); // Set material to edit
    setModalOpen(true); // Open modal
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditCliente(null); // Reset the user being edited
  };

  const handleClienteUpdate = async (updatedCliente) => {
    try {
      const res = await fetch(
        `https://admin-dashboard-arca-backend.vercel.app/dashboard/updateCliente/${updatedCliente.id_cliente}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCliente),
        }
      );
      const data = await res.json();
      console.log(data);

      if (res.ok) {

        const updatedData = data.cliente;


      // Actualizar estado de tipoMateriales
      setClientes((prev) =>
        prev.map((cliente) =>
            cliente.id_cliente === updatedData.id_cliente
            ? { ...cliente, ...updatedData } // Actualiza solo el material correspondiente
            : cliente
        )
      );

      // Actualizar estado de filteredMaterials
      setFilteredClientes((prev) =>
        prev.map((cliente) =>
            cliente.id_cliente === updatedData.id_cliente
            ? { ...cliente, ...updatedData } // Actualiza solo el material correspondiente
            : cliente
        )
      );
        handleModalClose(); // Close modal after updating
        toast.success("Cliente editado con exito!");
      } else {
        console.error("Error updating Cliente:", data.message);
        toast.error("Error al editar Cliente");
      }
    } catch (error) {
      console.error("Error updating Cliente:", error);
      toast.error("Error al editar Cliente");
    }
  };

  // Abrir modal de creación de material
  const handleCreateClick = () => setCreateModalOpen(true);

  // Cerrar modal de creación de material
  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setNewCliente({
        nombre_cliente: "",
        telefono_cliente: "",
        direccion_cliente: "",
    });
  };

  // Crear nuevo material en la base de datos
  const handleClienteCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://admin-dashboard-arca-backend.vercel.app/dashboard/createCliente",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCliente),
        }
      );
      if (res.ok) {
        const data = await res.json();

        setClientes([...clientes, data]);
        setFilteredClientes([...filteredClientes, data]);
        handleCreateModalClose(); // Cerrar modal después de crear
        toast.success("Cliente Creado con Exito!");
      } else {
        const errorData = await res.json();
        console.error("Error creating Cliente:", errorData.message);
        toast.error("Error al crear Cliente");
      }
    } catch (error) {
      console.error("Error creating Cliente:", error);
      toast.error("Error al crear Cliente");
    }
  };

    // Calcular datos a mostrar en la página actual
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredClientes.slice(indexOfFirstRow, indexOfLastRow);

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
          Clientes
        </h2>
        <div className="flex items-center relative">
          <input
            type="text"
            placeholder="Buscar Cliente..."
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
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Telefono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Direccion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentRows.map((cliente) => (
              <motion.tr
                key={cliente.id_donante}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {cliente.nombre_cliente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {cliente.telefono_cliente} 
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {cliente.direccion_cliente} 
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleEditClick(cliente)}
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
                handleClienteUpdate(editCliente); // Actualiza el Tipo Material
              }}
            >
              <div className="mb-3">
                <label className="block mb-1 text-gray-300">Nombre: </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editCliente?.nombre_cliente || ""}
                  onChange={(e) =>
                    setEditCliente({ ...editCliente, nombre_cliente: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-gray-300">Telefono: </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editCliente?.telefono_cliente || ""}
                  onChange={(e) =>
                    setEditCliente({ ...editCliente, telefono_cliente: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-gray-300">Direccion: </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editCliente?.direccion_cliente || ""}
                  onChange={(e) =>
                    setEditCliente({ ...editCliente, direccion_cliente: e.target.value })
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
              Agregar Cliente
            </h2>
            <form onSubmit={handleClienteCreate}>
            <div className="mb-3">
                <label className="block mb-1 text-gray-300">Nombre: </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newCliente.nombre_cliente}
                  onChange={(e) =>
                    setNewCliente({ ...newCliente, nombre_cliente: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-gray-300">Telefono: </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newCliente.telefono_cliente}
                  onChange={(e) =>
                    setNewCliente({ ...newCliente, telefono_cliente: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-gray-300">Direccion: </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newCliente.direccion_cliente}
                  onChange={(e) =>
                    setNewCliente({ ...newCliente, direccion_cliente: e.target.value })
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
                  Agregar Cliente
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
            Anterior
          </button>
          <span className="text-gray-400 mx-2 text-xs">
            Página {currentPage} de {Math.ceil(filteredClientes.length / rowsPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredClientes.length / rowsPerPage)}
            className="text-gray-400 hover:text-gray-300 px-3 py-2 text-xs"
          >
            Siguiente
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DonantesTable;
