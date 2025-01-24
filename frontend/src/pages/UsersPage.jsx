import Header from "../components/common/Header";
import UsersTable from "../components/users/UsersTable";

const UsersPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Usuarios' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 mt-20'>				
				<UsersTable />
			</main>
		</div>
	);
};
export default UsersPage;