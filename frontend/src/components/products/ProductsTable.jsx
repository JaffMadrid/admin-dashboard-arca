import { motion } from "framer-motion";
import { Search, Edit, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProductsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredMaterials, setFilteredMaterials] = useState([]);
	const [materialsData, setMaterialsData] = useState([]);
  const [editMaterial, setEditMaterial] = useState(null); // Estado para el material en edición
	const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal de edición
	const [tipoMateriales, setTipoMateriales] = useState([]); // Estado para almacenar tipo materiales
  const [donantes, setDonantes] = useState([]); // Estado para almacenar donantes
  const [estadoMateriales, setEstadoMateriales] = useState([]);// Estado para almacenar estado de materiales
	const [newMaterial, setNewMaterial] = useState({
		id_tipo_material: "",
		peso: "",
		fecha_ingreso: "",
		id_donante: "",
		id_estado_material: ""
	});
	const [createModalOpen, setCreateModalOpen] = useState(false); // Estado para el modal de creación


   useEffect(() => {
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

  const fetchTipoMateriales = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/tipoMateriales", { method: "GET" });
      const data = await res.json();
      setTipoMateriales(data); // Setea los tipos de materiales obtenidos
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  const fetchDonantes = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/donantes", { method: "GET" });
      const data = await res.json();
      setDonantes(data); // Setea los donantes obtenidos
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  const fetchEstadoMateriales= async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/estadoMateriales", { method: "GET" });
      const data = await res.json();
      setEstadoMateriales(data); // Setea los estados de materiales obtenidos
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

 
    fetchMaterials();
    fetchTipoMateriales();
    fetchDonantes();
    fetchEstadoMateriales();
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

  const handleEditClick = (material) => {
		setEditMaterial(material); // Set material to edit
		setModalOpen(true); // Open modal
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setEditMaterial(null); // Reset the user being edited
	};


  const handleMaterialUpdate = async (updatedMaterial) => {
		try {
			const res = await fetch(`http://localhost:5000/dashboard/updateMaterial/${updatedMaterial.id_material}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedMaterial),
			});
			const data = await res.json();

			if (res.ok) {
				// Buscar campos actualizados
				const updatedTipoMaterial = tipoMateriales.find(tipoMaterial => tipoMaterial.id_tipo_material === data.material.id_tipo_material);
				const newTipoMaterialName = updatedTipoMaterial ? updatedTipoMaterial.descripcion_tipo : "Sin tipo";

				const updatedDonante = donantes.find(donante => donante.id_donante === data.material.id_donante);
				const newDonanteName = updatedDonante ? updatedDonante.nombre_donante : "Sin nombre donante";

        const updatedEstadoMaterial = estadoMateriales.find(estadoMaterial => estadoMaterial.id_estado_material === data.material.id_estado_material);
				const newEstadoMaterialName = updatedEstadoMaterial ? updatedEstadoMaterial.descripcion_estado : "Sin estado material";


        const updatedMaterialWithDetails = { ...data.material, descripcion_tipo: newTipoMaterialName , nombre_donante: newDonanteName, descripcion_estado: newEstadoMaterialName};

				setMaterialsData((prev) =>
					prev.map((material) => (material.id_material === updatedMaterialWithDetails.id_material ? updatedMaterialWithDetails : material))
				);
				setFilteredMaterials((prev) =>
					prev.map((material) => (material.id_material === updatedMaterialWithDetails.id_material ? updatedMaterialWithDetails : material))
				);
				handleModalClose(); // Close modal after updating
				toast.success("Material editado con exito!");
			} else {
				console.error("Error updating Material:", data.message);
				toast.error("Error al editar Material");
			}
		} catch (error) {
			console.error("Error updating Material:", error);
			toast.error("Error al editar Material");
		}
	};

  // Abrir modal de creación de material
	const handleCreateClick = () => setCreateModalOpen(true);

	// Cerrar modal de creación de material
	const handleCreateModalClose = () => {
		setCreateModalOpen(false);
		setNewMaterial({ id_tipo_material: "",
      peso: "",
      fecha_ingreso: "",
      id_donante: "",
      id_estado_material: ""});
	};

  // Crear nuevo material en la base de datos
	const handleMaterialCreate = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("http://localhost:5000/dashboard/createMaterial", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newMaterial),
			});
			if (res.ok) {
				const data = await res.json();
				// Buscar descripcion material del tipo material basado en id_tipo_material
				const updatedTipoMaterial = tipoMateriales.find(tipoMaterial => tipoMaterial.id_tipo_material === data.id_tipo_material);
				const newTipoMaterialName = updatedTipoMaterial ? updatedTipoMaterial.descripcion_tipo : "Sin tipo";

				const updatedDonante = donantes.find(donante => donante.id_donante === data.id_donante);
				const newDonanteName = updatedDonante ? updatedDonante.nombre_donante : "Sin nombre donante";

        const updatedEstadoMaterial = estadoMateriales.find(estadoMaterial => estadoMaterial.id_estado_material === data.id_estado_material);
				const newEstadoMaterialName = updatedEstadoMaterial ? updatedEstadoMaterial.descripcion_estado : "Sin estado material";


        const createdMaterialWithDetails = { ...data, descripcion_tipo: newTipoMaterialName , nombre_donante: newDonanteName, descripcion_estado: newEstadoMaterialName};
        console.log(createdMaterialWithDetails);
				
				setMaterialsData([...materialsData, createdMaterialWithDetails]); // Agregar el nuevo usuario a la lista
				setFilteredMaterials([...filteredMaterials, createdMaterialWithDetails]);

				handleCreateModalClose(); // Cerrar modal después de crear
				toast.success("Material Creado con Exito!");
			} else {
				const errorData = await res.json();
				console.error("Error creating Material:", errorData.message);
				toast.error("Error al crear Material");
				
			}
		} catch (error) {
			console.error("Error creating Material:", error);
			toast.error("Error al crear Material");
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
        <h2 className="text-xl font-semibold text-gray-100">Inventario de Materiales Reciclables</h2>
        <div className="flex items-center relative">
          <input
            type="text"
            placeholder="Buscar Materiales..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <button className='ml-4 text-green-400 hover:text-green-300' onClick={handleCreateClick}>
						<PlusCircle size={24} />
					</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Peso (lb)</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{material.peso} lb</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(material.fecha_ingreso).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{material.nombre_donante}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      material.descripcion_estado === "En inventario"
                        ? "bg-blue-800 text-blue-100"
                        : material.descripcion_estado === "Procesando"
                        ? "bg-yellow-800 text-yellow-100"
                        : material.descripcion_estado === "Vendido"
                        ? "bg-green-800 text-green-100"
                        : ""
                    }`}
									>
										{material.descripcion_estado} 
									</span>
                  </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => handleEditClick(material)}>
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
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 w-96'>
						<h2 className='text-2xl font-semibold text-gray-100 mb-4'>Editar Material</h2>
						<form onSubmit={(e) => {
							e.preventDefault();
							handleMaterialUpdate(editMaterial); // Actualiza el usuario
						}}>
							<div className='mb-3'>
              <label className='block mb-1 text-gray-300'>Tipo Material:</label>
								<select
									className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded'
									value={editMaterial?.id_tipo_material || ''}
									onChange={(e) => setEditMaterial({ ...editMaterial, id_tipo_material: e.target.value })}
								>
									<option value='' disabled>Selecciona un tipo de material</option>
									{tipoMateriales.map((tipoMaterial) => (
										<option key={tipoMaterial.id_tipo_material} value={tipoMaterial.id_tipo_material}>
											{tipoMaterial.descripcion_tipo}
										</option>
									))}
								</select>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Peso (lb)</label>
								<input
									type='text'
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={editMaterial?.peso || ''}
									onChange={(e) => setEditMaterial({ ...editMaterial, peso: e.target.value })}
								/>
							</div>
							<div className='mb-3'>
              <label className='block mb-1 text-gray-300'>Donante:</label>
								<select
									className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded'
									value={editMaterial?.id_donante|| ''}
									onChange={(e) => setEditMaterial({ ...editMaterial, id_donante: e.target.value })}
								>
									<option value='' disabled>Selecciona un Donante</option>
									{donantes.map((donante) => (
										<option key={donante.id_donante} value={donante.id_donante}>
											{donante.nombre_donante}
										</option>
									))}
								</select>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Estado Material:</label>
								<select
									className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded'
									value={editMaterial?.id_estado_material || ''}
									onChange={(e) => setEditMaterial({ ...editMaterial, id_estado_material: e.target.value })}
								>
									<option value='' disabled>Selecciona un estado material</option>
									{estadoMateriales.map((estadoMaterial) => (
										<option key={estadoMaterial.id_estado_material} value={estadoMaterial.id_estado_material}>
											{estadoMaterial.descripcion_estado}
										</option>
									))}
								</select>
							</div>
							<div className='flex justify-between mt-4'>
								<button type='button' className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200' onClick={handleModalClose}>Cancelar</button>
								<button type='submit' className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'>Actualizar</button>
							</div>
						</form>
					</div>
				</div>
			)}
      {createModalOpen && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 w-96'>
						<h2 className='text-2xl font-semibold text-gray-100 mb-4'>Agregar Material</h2>
						<form onSubmit={handleMaterialCreate}>
							<div className='mb-3'>
              <label className='block mb-1 text-gray-300'>Tipo Material:</label>
								<select
									className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={newMaterial.id_tipo_material}
									onChange={(e) => setNewMaterial({ ...newMaterial, id_tipo_material: e.target.value })}
									required
								>
									<option value='' disabled>Selecciona un Tipo de Material</option>
									{tipoMateriales.map((tipoMaterial) => (
										<option key={tipoMaterial.id_tipo_material} value={tipoMaterial.id_tipo_material}>
											{tipoMaterial.descripcion_tipo}
										</option>
									))}
								</select>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Peso (lb):</label>
								<input
									type='number'
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={newMaterial.peso}
									onChange={(e) => setNewMaterial({ ...newMaterial, peso: e.target.value })}
									required
								/>
							</div>
							<div className='mb-3'>
              <label className='block mb-1 text-gray-300'>Donante:</label>
								<select
									className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={newMaterial.id_donante}
									onChange={(e) => setNewMaterial({ ...newMaterial, id_donante: e.target.value })}
									required
								>
									<option value='' disabled>Selecciona un Donante</option>
									{donantes.map((donante) => (
										<option key={donante.id_donante} value={donante.id_donante}>
											{donante.nombre_donante}
										</option>
									))}
								</select>
							</div>
							<div className='mb-3'>
              <label className='block mb-1 text-gray-300'>Estado Material:</label>
								<select
									className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={newMaterial.id_estado_material}
									onChange={(e) => setNewMaterial({ ...newMaterial, id_estado_material: e.target.value })}
									required
								>
									<option value='' disabled>Selecciona el Estado del Material</option>
									{estadoMateriales.map((estadoMaterial) => (
										<option key={estadoMaterial.id_estado_material} value={estadoMaterial.id_estado_material}>
											{estadoMaterial.descripcion_estado}
										</option>
									))}
								</select>
							</div>
							<div className='flex justify-end space-x-3'>
								<button type='button' className='bg-red-600 px-4 py-2 rounded text-white' onClick={handleCreateModalClose}>Cancelar</button>
								<button type='submit' className='bg-green-600 px-4 py-2 rounded text-white'>Agregar Material</button>
							</div>
						</form>
					</div>
				</div>
			)}
    </motion.div>
  );
};

export default ProductsTable;
