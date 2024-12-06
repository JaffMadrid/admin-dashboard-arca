import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const defaultImage = "https://randomuser.me/api/portraits/men/3.jpg";



  const getProfile = async () => {
    try {
      const res = await fetch("https://admin-dashboard-arca-backend.vercel.app/dashboard/profile", {
        method: "GET",
        headers: { jwtToken: localStorage.token },
      });

      const parseData = await res.json();
      setName(parseData.nombre);
      setEmail(parseData.correo);
      setEditName(parseData.nombre);
      setEditEmail(parseData.correo);
      setImageUrl(parseData.imagen_url);
      setEditImageUrl(parseData.imagen_url);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const body = { 
        nombre: editName, 
        correo: editEmail,
        imagen_url: editImageUrl 
      };
      
      const response = await fetch("https://admin-dashboard-arca-backend.vercel.app/dashboard/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          jwtToken: localStorage.token,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success("Perfil actualizado con éxito!");
        setName(editName);
        setEmail(editEmail);
        setImageUrl(editImageUrl);
        setShowModal(false);
      } else {
        const data = await response.json();
        toast.error(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar perfil!");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <SettingSection icon={User} title={"Perfil"}>
      <div className="flex flex-col sm:flex-row items-center mb-6 z-20">
        <div>
          {/* Hide default image completely */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Profile"
              style={{ display: imageLoaded ? "block" : "none" }}
              onLoad={() => setImageLoaded(true)}
            />
          )}

          {/* Only show default while imageUrl is null/undefined */}
          {!imageUrl && <img src={defaultImage} alt="Default Profile" />}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-100">{name}</h3>
          <p className="text-gray-400">{email}</p>
        </div>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
      >
        Editar Perfil
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 w-96 z-20">
            <h2 className="text-xl mb-4">Editar Perfil</h2>

            <label className="block mb-1 text-gray-300">
              URL Imagen de Perfil:
            </label>
            <input
              type="text"
              placeholder="URL de la imagen"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
            />
            <label className="block mb-1 text-gray-300">Nombre:</label>
            <input
              type="text"
              placeholder="Nombre"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
            />
            <label className="block mb-1 text-gray-300">Correo:</label>
            <input
              type="email"
              placeholder="Correo"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditName(name);
                  setEditEmail(email);
                  setEditImageUrl(imageUrl);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateProfile}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingSection>
  );
};

export default Profile;