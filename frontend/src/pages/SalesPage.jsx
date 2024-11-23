import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";
import SalesTable from "../components/sales/SalesTable";
import TipoMaterialesTable from "../components/sales/TipoMaterialesTable";
import DonantesTable from "../components/sales/DonantesTable";
import ClientsTable from "../components/sales/ClientsTable";

const salesStats = {
	totalRevenue: "L. 350,000",
	averageOrderValue: "L. 1,500",
	conversionRate: "3.45%",
	salesGrowth: "12.3%",
};

const SalesPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Venta de Material' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

				{/* SALES STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Ganancia Total' icon={DollarSign} value={salesStats.totalRevenue} color='#6366F1' />
					<StatCard
						name='Prom. de Valor de Venta'
						icon={ShoppingCart}
						value={salesStats.averageOrderValue}
						color='#10B981'
					/>
					<StatCard
						name='CConversion a Venta'
						icon={TrendingUp}
						value={salesStats.conversionRate}
						color='#F59E0B'
					/>
					<StatCard name='Crecimiento de Ventas' icon={CreditCard} value={salesStats.salesGrowth} color='#EF4444' />
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
				<SalesTable />
				<TipoMaterialesTable/>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
				<DonantesTable />
				<ClientsTable/>
				</div>
				<SalesOverviewChart />
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<SalesByCategoryChart />
					<DailySalesTrend />
				</div>
			</main>
		</div>
	);
};
export default SalesPage;