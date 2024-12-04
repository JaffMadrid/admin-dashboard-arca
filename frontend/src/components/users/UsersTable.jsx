import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Edit, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [editUser, setEditUser] = useState(null); // Estado para el usuario en edición
	const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal de edición
	const [roles, setRoles] = useState([]); // Estado para almacenar roles
	const [newUser, setNewUser] = useState({
		nombre: "",
		correo: "",
		usuario: "",
		contrasena: "",
		id_rol: "",
		estado_usuario: true
		
	});
	const [createModalOpen, setCreateModalOpen] = useState(false); // Estado para el modal de creación

	// Fetch user data from the API
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch("http://localhost:5000/dashboard/userInfo", { method: "GET" });
				const data = await res.json();
				setUsers(data);
				setFilteredUsers(data); // Initialize filtered users with all users
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		const fetchRoles = async () => {
			try {
				const res = await fetch("http://localhost:5000/dashboard/roles", { method: "GET" });
				const data = await res.json();
				setRoles(data); // Setea los roles obtenidos
			} catch (error) {
				console.error("Error fetching roles:", error);
			}
		};

		fetchRoles();
		fetchUsers(); 
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = users.filter(
			(user) => 
				user.nombre.toLowerCase().includes(term) || 
				user.correo.toLowerCase().includes(term) || 
				user.usuario.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	const handleEditClick = (user) => {
		setEditUser(user); // Set user to edit
		setModalOpen(true); // Open modal
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setEditUser(null); // Reset the user being edited
	};

	const handleUserUpdate = async (updatedUser) => {
		try {
			const res = await fetch(`http://localhost:5000/dashboard/updateUser/${updatedUser.id_usuario}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedUser),
			});
			const data = await res.json();

			if (res.ok) {
				// Buscar el nombre del rol actualizado
				const updatedRole = roles.find(role => role.id_rol === data.usuario.id_rol);
				const newRoleName = updatedRole ? updatedRole.nombre_rol : "Sin rol";

				// Actualiza la lista de usuarios con el nombre del rol
				const updatedUserWithRole = { ...data.usuario, nombre_rol: newRoleName };

				setUsers((prev) =>
					prev.map((user) => (user.id_usuario === updatedUserWithRole.id_usuario ? updatedUserWithRole : user))
				);
				setFilteredUsers((prev) =>
					prev.map((user) => (user.id_usuario === updatedUserWithRole.id_usuario ? updatedUserWithRole : user))
				);
				handleModalClose(); // Close modal after updating
				toast.success("Usuario editado con exito!");
			} else {
				console.error("Error updating user:", data.message);
				toast.error("Error al editar usuario");
			}
		} catch (error) {
			console.error("Error updating user:", error);
			toast.error("Error al editar usuario");
		}
	};

	// Abrir modal de creación de usuario
	const handleCreateClick = () => setCreateModalOpen(true);

	// Cerrar modal de creación de usuario
	const handleCreateModalClose = () => {
		setCreateModalOpen(false);
		setNewUser({ nombre: "", correo: "", usuario: "", id_rol: "", estado_usuario: true, contrasena: "" });
	};

	// Crear nuevo usuario en la base de datos
	const handleUserCreate = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("http://localhost:5000/dashboard/createUser", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newUser),
			});
			if (res.ok) {
				const createdUser = await res.json();
				// Buscar el nombre del rol basado en id_rol
				const role = roles.find(role => role.id_rol === createdUser.id_rol);
				const newRoleName = role ? role.nombre_rol : "Sin rol";
				const createdUserWithRole = { ...createdUser, nombre_rol: newRoleName };
				
				setUsers([...users, createdUserWithRole]); // Agregar el nuevo usuario a la lista
				setFilteredUsers([...filteredUsers, createdUserWithRole]);
				handleCreateModalClose(); // Cerrar modal después de crear
				toast.success("Usuario Creado con Exito!");
			} else {
				const errorData = await res.json();
				console.error("Error creating user:", errorData.message);
				toast.error("Error al crear usuario");

			}
		} catch (error) {
			console.error("Error creating user:", error);
			toast.error("Error al crear usuario");
		}
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6 relative'>
				<h2 className='text-xl font-semibold text-gray-100'>Usuarios</h2>
				<div className='flex items-center relative'>
					<input
						type='text'
						placeholder='Buscar Usuarios...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
					<button className='ml-4 text-green-400 hover:text-green-300' onClick={handleCreateClick}>
						<PlusCircle size={24} />
					</button>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Nombre</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Correo</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Usuario</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Rol</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Estado</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Acciones</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredUsers.map((user) => (
							<motion.tr
								key={user.id_usuario} // Utiliza id_usuario para la clave
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
												{user.nombre.charAt(0)}
											</div>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-gray-100'>{user.nombre}</div>
										</div>
									</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{user.correo}</div>
								</td>
								
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{user.usuario}</div> 
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
										{user.nombre_rol} 
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											user.estado_usuario ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"
										}`}
									>
										{user.estado_usuario ? "Activo" : "Inactivo"} 
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => handleEditClick(user)}>
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
						<h2 className='text-2xl font-semibold text-gray-100 mb-4'>Editar Usuario</h2>
						<form onSubmit={(e) => {
							e.preventDefault();
							handleUserUpdate(editUser); // Actualiza el usuario
						}}>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Nombre:</label>
								<input
									type='text'
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={editUser?.nombre || ''}
									onChange={(e) => setEditUser({ ...editUser, nombre: e.target.value })}
								/>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Correo:</label>
								<input
									type='email'
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={editUser?.correo || ''}
									onChange={(e) => setEditUser({ ...editUser, correo: e.target.value })}
								/>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Usuario:</label>
								<input
									type='text'
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={editUser?.usuario || ''}
									onChange={(e) => setEditUser({ ...editUser, usuario: e.target.value })}
								/>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Rol:</label>
								<select
									className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded'
									value={editUser?.id_rol || ''}
									onChange={(e) => setEditUser({ ...editUser, id_rol: e.target.value })}
								>
									<option value='' disabled>Selecciona un rol</option>
									{roles.map((role) => (
										<option key={role.id_rol} value={role.id_rol}>
											{role.nombre_rol}
										</option>
									))}
								</select>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Estado:</label>
								<select
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={editUser?.estado_usuario ? "activo" : "inactivo"}
									onChange={(e) => setEditUser({ ...editUser, estado_usuario: e.target.value === "activo" })}
								>
									<option value='activo'>Activo</option>
									<option value='inactivo'>Inactivo</option>
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

			{/* Modal de creación */}
			{createModalOpen && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 w-96'>
						<h2 className='text-2xl font-semibold text-gray-100 mb-4'>Agregar Usuario</h2>
						<form onSubmit={handleUserCreate}>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Nombre:</label>
								<input
									type='text'
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={newUser.nombre}
									onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
									required
								/>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Correo:</label>
								<input
									type='email'
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={newUser.correo}
									onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })}
									required
								/>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Usuario:</label>
								<input
									type='text'
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={newUser.usuario}
									onChange={(e) => setNewUser({ ...newUser, usuario: e.target.value })}
									required
								/>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Rol:</label>
								<select
									className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={newUser.id_rol}
									onChange={(e) => setNewUser({ ...newUser, id_rol: e.target.value })}
									required
								>
									<option value='' disabled>Selecciona un rol</option>
									{roles.map((role) => (
										<option key={role.id_rol} value={role.id_rol}>
											{role.nombre_rol}
										</option>
									))}
								</select>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Estado:</label>
								<select
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={newUser.estado_usuario ? "activo" : "inactivo"}
									onChange={(e) => setNewUser({ ...newUser, estado_usuario: e.target.value === "activo" })}
								>
									<option value='activo'>Activo</option>
									<option value='inactivo'>Inactivo</option>
								</select>
							</div>
							<div className='mb-3'>
								<label className='block mb-1 text-gray-300'>Contraseña:</label>
								<input
									type='password'
									className='w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={newUser.contrasena}
									onChange={(e) => setNewUser({ ...newUser, contrasena: e.target.value })}
									required
								/>
							</div>
							<div className='flex justify-end space-x-3'>
								<button type='button' className='bg-red-600 px-4 py-2 rounded text-white' onClick={handleCreateModalClose}>Cancelar</button>
								<button type='submit' className='bg-green-600 px-4 py-2 rounded text-white'>Crear Usuario</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</motion.div>
	);
};

export default UsersTable;
