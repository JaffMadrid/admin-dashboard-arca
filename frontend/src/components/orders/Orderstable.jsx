import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";


const OrdersTable = () => {
	const [bitacoraData, setBitacoraData] = useState([]);
  	const [filteredBitacora, setFilteredBitacora] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  	const [rowsPerPage, setRowsPerPage] = useState(10); // Número máximo de filas por página


useEffect(() => {
	const fetchBitacora = async () => {
		try {
		  const response = await fetch(
			"https://admin-dashboard-arca-backend.vercel.app/dashboard/bitacora"
		  );
		  const data = await response.json();
		  setBitacoraData(data);
		  setFilteredBitacora(data);
		} catch (error) {
		  console.error("Error fetching Bitacora:", error);
		}
	  };
  
	  fetchBitacora();
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = bitacoraData.filter(
			(bitacora) => bitacora.usuario.toLowerCase().includes(term) || bitacora.accion.toLowerCase().includes(term)
		);
		setFilteredBitacora(filtered);
		setCurrentPage(1);
	};

	    // Calcular datos a mostrar en la página actual
		const indexOfLastRow = currentPage * rowsPerPage;
		const indexOfFirstRow = indexOfLastRow - rowsPerPage;
		const currentRows = filteredBitacora.slice(indexOfFirstRow, indexOfLastRow);
	  
		// Manejar cambio de página
		const handlePageChange = (newPage) => setCurrentPage(newPage);
	  
		// Manejar cambio de cantidad de filas por página
		const handleRowsPerPageChange = (e) => {
		  setRowsPerPage(parseInt(e.target.value));
		  setCurrentPage(1); // Reiniciar a la primera página
		};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Bitacora</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Buscar en Bitacora...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Usuario
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Accion
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Fecha de Accion
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Informacion Afectada
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Detalles
							</th>
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{currentRows.map((bitacora) => (
							<motion.tr
								key={bitacora.id_bitacora}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{bitacora.usuario}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{bitacora.accion}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{bitacora.fecha_accion}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{bitacora.tabla_afectada}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
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
          <label className="text-gray-400 mr-2">Filas por página:</label>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="text-gray-400 hover:text-gray-300 px-3 py-2"
          >
            <ChevronLeft/>
          </button>
          <span className="text-gray-400 mx-2">
            Página {currentPage} de {Math.ceil(filteredBitacora.length / rowsPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredBitacora.length / rowsPerPage)}
            className="text-gray-400 hover:text-gray-300 px-3 py-2"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
		</motion.div>
	);
};
export default OrdersTable;