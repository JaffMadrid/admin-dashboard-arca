import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import { useState } from "react";
import { toast } from "react-toastify"

const Security = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");


  const clearPasswordFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Las nuevas contraseñas no coinciden!");
      return;
    }

    try {
      const body = { currentPassword, newPassword };
      const response = await fetch("http://localhost:5000/dashboard/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          jwtToken: localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Contraseña cambiada con exito!");
        setShowModal(false);
        clearPasswordFields();
      } else {
        toast.error(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al cambiar contraseña!");
    }
  };

  return (
    <SettingSection icon={Lock} title={"Seguridad"}>
      <div className="mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded 
        transition duration-200">
          Cambiar Contraseña
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 w-96 ">
            <h2 className="text-xl mb-4">Cambiar Contraseña</h2>
            <label className='block mb-1 text-gray-300'>Contraseña Actual:</label>
            <input
              type="password"
              placeholder=""
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
            />
            <label className='block mb-1 text-gray-300'>Nueva Contraseña:</label>
            <input
              type="password"
              placeholder=""
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
            />
            <label className='block mb-1 text-gray-300'>Confirmar Nueva Contraseña:</label>
            <input
              type="password"
              placeholder=""
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 "
            />
            <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                setShowModal(false);
                clearPasswordFields();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 ">
              Cancelar
        </button>
            <button
              onClick={handleChangePassword}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto">
              Cambiar
            </button>
            </div>
          </div>
        </div>
      )}
    </SettingSection>
  );
};

export default Security;
