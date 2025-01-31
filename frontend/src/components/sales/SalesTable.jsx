import { motion } from "framer-motion";
import { Search, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";


const SalesTable = ({ onSaleComplete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [materialsData, setMaterialsData] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Número máximo de filas por página
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [prices, setPrices] = useState({});
  const [defaultPrices, setDefaultPrices] = useState({});
  const [originalPrices, setOriginalPrices] = useState({});
  const [totalVenta, setTotalVenta] = useState(0);

  useEffect(() => {
    // Función para obtener los datos de materiales de la API
    const fetchMaterials = async () => {
      try {
        const res = await fetch(
          "https://admin-dashboard-arca-backend.vercel.app/dashboard/materialesForSaleTable"
        ); // Ajusta la URL según tu ruta API
        const data = await res.json();
        setMaterialsData(data);
        setFilteredMaterials(data);
      } catch (error) {
        console.error("Error al obtener datos de materiales:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const res = await fetch(
          "https://admin-dashboard-arca-backend.vercel.app/dashboard/clientes"
        );
        const data = await res.json();
        setClients(data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    const fetchDefaultPrices = async () => {
      try {
        const res = await fetch(
          "https://admin-dashboard-arca-backend.vercel.app/dashboard/tipoMateriales"
        );
        const data = await res.json();

        // Mapear precios por id_tipo_material
        const pricesMap = {};
        data.forEach((tipo) => {
          pricesMap[tipo.id_tipo_material] = tipo.preciolibra;
        });

        setDefaultPrices(pricesMap);
        setOriginalPrices(pricesMap);
      } catch (error) {
        console.error("Error al obtener precios por libra:", error);
      }
    };
    fetchMaterials();
    fetchClients();
    fetchDefaultPrices();
  }, []);


  useEffect(() => {
    const newTotal = selectedMaterials.reduce(
      (total, material) =>
        total + material.peso_total * defaultPrices[material.id_tipo_material],
      0
    );
    setTotalVenta(newTotal);
  }, [selectedMaterials, defaultPrices]);

  const handleCheckboxChange = (material) => {
    setSelectedMaterials((prev) =>
      prev.some((item) => item.id_tipo_material === material.id_tipo_material)
        ? prev.filter(
            (item) => item.id_tipo_material !== material.id_tipo_material
          )
        : [...prev, material]
    );

    // Agregar precio default si no está en la lista
    if (
      !prices[material.id_tipo_material] &&
      defaultPrices[material.id_tipo_material]
    ) {
      setPrices((prevPrices) => ({
        ...prevPrices,
        [material.id_tipo_material]: defaultPrices[material.id_tipo_material],
      }));
    }
  };

  const handlePriceChange = (materialId, newPrice) => {
    setDefaultPrices((prevPrices) => ({
      ...prevPrices,
      [materialId]: newPrice === "" ? "" : parseFloat(newPrice),
    }));
  };

  const handleCloseModal = () => {
    setSelectedMaterials([]);
    setSelectedClient(null);
    setDefaultPrices({ ...originalPrices });
    setTotalVenta(0);
    setShowModal(false);
  };

  const handleSellMaterials = async () => {
    if (!selectedClient) {
      toast.error("Por favor, selecciona un cliente.");
      return;
    }

    try {
      // Obtener materiales individuales de los seleccionados
      const res = await fetch(
        "https://admin-dashboard-arca-backend.vercel.app/dashboard/materialesForSale"
      );
      const data = await res.json();

      const materialesIndividuales = data.filter((material) =>
        selectedMaterials.some(
          (selected) => selected.id_tipo_material === material.id_tipo_material
        )
      );

      const idMateriales = materialesIndividuales.map(
        (material) => material.id_material
      );

      const response = await fetch(
        "https://admin-dashboard-arca-backend.vercel.app/dashboard/venderMateriales",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            jwtToken: localStorage.token,
          },
          body: JSON.stringify({
            materiales: idMateriales,
          }),
        }
      );
      await fetch(
        "https://admin-dashboard-arca-backend.vercel.app/dashboard/createVenta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            jwtToken: localStorage.token,
          },
          body: JSON.stringify({
            id_cliente: selectedClient,
            total: totalVenta, // Make sure you have this variable with the total
          }),
        }
      );

      // Get latest venta id
      const ventaRes = await fetch(
        "https://admin-dashboard-arca-backend.vercel.app/dashboard/lastVenta"
      );
      const ventaData = await ventaRes.json();

      // Create detalle_venta records
      await fetch(
        "https://admin-dashboard-arca-backend.vercel.app/dashboard/createDetalleVenta",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_venta: ventaData.id_venta,
            materiales: idMateriales,
          }),
        }
      );
      
      if (response.ok) {
        toast.success("Materiales vendidos exitosamente.");
        setShowModal(false);
        setSelectedMaterials([]);
        onSaleComplete()
        setMaterialsData((prevMaterials) =>
          prevMaterials.filter(
            (material) =>
              !selectedMaterials.some(
                (selected) =>
                  selected.id_tipo_material === material.id_tipo_material
              )
          )
        );
        setFilteredMaterials((prevMaterials) =>
          prevMaterials.filter(
            (material) =>
              !selectedMaterials.some(
                (selected) =>
                  selected.id_tipo_material === material.id_tipo_material
              )
          )
        );
      } else {
        toast.error("Error al vender materiales.");
      }
    } catch (error) {
      console.error("Error al procesar la venta:", error);
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = materialsData.filter((material) =>
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
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar Materiales..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <button
            className="ml-4 text-green-400 hover:text-green-300"
            onClick={() => setShowModal(true)}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Seleccionar para Vender
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
                <td className="px-6 py-4 flex justify-center whitespace-nowrap text-sm center text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.some(
                      (item) =>
                        item.id_tipo_material === material.id_tipo_material
                    )}
                    onChange={() => handleCheckboxChange(material)}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 w-96">
            <h3 className="text-2xl font-semibold text-gray-100 mb-4">
              Confirmar Venta
            </h3>
            <div className="mb-4">
              <label className="block text-white mb-2">
                Seleccionar Cliente
              </label>
              <select
                className="w-full p-2 rounded-lg bg-gray-800 text-white"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="">-- Seleccionar Cliente --</option>
                {clients.map((client) => (
                  <option key={client.id_cliente} value={client.id_cliente}>
                    {client.nombre_cliente}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2 flex justify-between">
              <label className="block mb-1 text-gray-300">Nombre </label>
              <label className="block mb-1 text-gray-300">Precio LB </label>
              <label className="block mb-1 text-gray-300">Total </label>
            </div>
            <div className="flex justify-between">
              <ul className="">
                {selectedMaterials.map((material) => (
                  <li
                    key={material.id_tipo_material}
                    className="text-white grid grid-cols-3 items-center my-3"
                  >
                    <span className="">
                      {material.descripcion_tipo} - {material.peso_total} lb
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={defaultPrices[material.id_tipo_material]}
                      onChange={(e) =>
                        handlePriceChange(
                          material.id_tipo_material,
                          e.target.value
                        )
                      }
                      className="w-20 px-2 py-1 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right justify-self-center"
                    />
                    <span className="text-green-400 justify-self-end">
                      L.
                      {(
                        material.peso_total *
                        defaultPrices[material.id_tipo_material]
                      ).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-gray-600 pt-4 mt-4">
              <div className="flex justify-between text-white">
                <span className="font-semibold">Total de Venta:</span>
                <span className="text-green-400 font-bold">
                  L. {totalVenta.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex justify-between space-x-3 mt-4">
              <button
                className="bg-red-600 px-4 py-2 rounded text-white"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 px-4 py-2 rounded text-white"
                onClick={handleSellMaterials}
              >
                Vender
              </button>
            </div>
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
  
  export default SalesTable;