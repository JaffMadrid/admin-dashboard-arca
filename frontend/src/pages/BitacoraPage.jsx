import { CheckCircle, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import BitacoraTable from "../components/bitacora/BitacoraTable";



const orderStats = {	
	totalOrders: "5",
	completedOrders: "5",

};

const OrdersPage = () => {
	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			<Header title={"Donaciones"} />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-2 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Acciones Totales' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
					<StatCard
						name='Acciones Completadas'
						icon={CheckCircle}
						value={orderStats.completedOrders}
						color='#10B981'
					/>
				</motion.div>
				<BitacoraTable />
			</main>
		</div>
	);
};
export default OrdersPage;