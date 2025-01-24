
import Header from "../components/common/Header";

import BitacoraTable from "../components/bitacora/BitacoraTable";


const OrdersPage = () => {
	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			<Header title={"Donaciones"} />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<BitacoraTable />
			</main>
		</div>
	);
};
export default OrdersPage;