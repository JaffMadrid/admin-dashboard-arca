import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useState, useEffect } from "react";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { jwtToken: localStorage.token },
      });

      const parseData = await res.json();
      setName(parseData.nombre);
	  setEmail(parseData.correo);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <SettingSection icon={User} title={"Perfil"}>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <img
          src="https://randomuser.me/api/portraits/men/3.jpg"
          alt="Profile"
          className="rounded-full w-20 h-20 object-cover mr-4"
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-100">{name}</h3>
          <p className="text-gray-400">{email}</p>
        </div>
      </div>

      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto">
        Editar Perfil
      </button>
    </SettingSection>
  );
};
export default Profile;