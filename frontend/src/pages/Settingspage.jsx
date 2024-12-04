import Header from "../components/common/Header";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Perfil' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<div className="mb-20">
				<Profile />

				</div>
				<div className="">
				<Security />

				</div>
			</main>
		</div>
	);
};
export default SettingsPage;