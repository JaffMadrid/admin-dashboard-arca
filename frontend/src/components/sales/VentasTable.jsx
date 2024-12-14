import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { PDFViewer } from '@react-pdf/renderer';
import FacturaPDF from './FacturaPDF';


const VentasTable = ({ updateTrigger }) => {
  const [ventasData, setVentasData] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Número máximo de filas por página
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [showPDF, setShowPDF] = useState(false);


  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch(
          "https://admin-dashboard-arca-backend.vercel.app/dashboard/ventas"
        );
        const data = await response.json();
        setVentasData(data);
        setFilteredVentas(data);
      } catch (error) {
        console.error("Error fetching ventas:", error);
      }
    };

    fetchVentas();
  }, [updateTrigger]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = ventasData.filter((venta) =>
      venta.nombre_cliente.toLowerCase().includes(term)
    );
    setFilteredVentas(filtered);
    setCurrentPage(1);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredVentas.slice(indexOfFirstRow, indexOfLastRow);
  // Manejar cambio de página
  const handlePageChange = (newPage) => setCurrentPage(newPage);

  // Manejar cambio de cantidad de filas por página
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reiniciar a la primera página
  };

  const formatDateForPDF = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString(); // Fallback to current date
      }
      return date.toISOString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return new Date().toISOString(); // Fallback to current date
    }
  };

  const handleVerFactura = async (id_venta) => {
    try {
      const response = await fetch(
        `https://admin-dashboard-arca-backend.vercel.app/dashboard/ventaDetalle/${id_venta}`
      );
      const data = await response.json();
      // Ensure data is an array
      const materialesArray = Array.isArray(data) ? data : [data];

      // Get client info from first item since it's the same for all
      const firstItem = materialesArray[0];

      // Calculate total from all materials
      const totalVenta = materialesArray.reduce((sum, item) => {
        const subtotal = parseFloat(item.peso) * parseFloat(item.preciolibra);
        return sum + subtotal;
      }, 0);

      // Format the data using the first item for client info
      const formattedData = {
        id_venta: firstItem.id_venta,
        fecha_venta: formatDateForPDF(firstItem.fecha_venta),
        nombre_cliente: firstItem.nombre_cliente,
        direccion_cliente: firstItem.direccion_cliente,
        total: totalVenta.toFixed(2),
        materiales: materialesArray,
      };

      setSelectedVenta(formattedData);
      setShowPDF(true);
    } catch (error) {
      console.error("Error al obtener detalle de venta:", error);
    }
  };


  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Historial de Ventas
        </h2>
        <div className="flex items-center relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Codigo Factura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ver Factura
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentRows.map((venta) => (
              <motion.tr
                key={venta.id_venta}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  CD2024{venta.id_venta}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {venta.nombre_cliente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {format(new Date(venta.fecha_venta), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  L. {venta.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleVerFactura(venta.id_venta)}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <label className="text-gray-400 mr-2 text-xs">
            Filas por página:
          </label>
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
            Página {currentPage} de{" "}
            {Math.ceil(filteredVentas.length / rowsPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredVentas.length / rowsPerPage)
            }
            className="text-gray-400 hover:text-gray-300 px-3 py-2 text-xs"
          >
            <ChevronRight/>
          </button>
        </div>
      </div>

      {showPDF && selectedVenta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-4/5 h-5/6 rounded-lg">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setShowPDF(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <PDFViewer style={{ width: "100%", height: "90%" }}>
              <FacturaPDF ventaData={selectedVenta} />
            </PDFViewer>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VentasTable;