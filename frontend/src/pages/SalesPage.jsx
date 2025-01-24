import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
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
import VentasTable from "../components/sales/VentasTable";
import { useVentasUpdate } from "../hooks/useVentasUpdate";


const SalesPage = () => {
  const { updateTrigger, triggerUpdate } = useVentasUpdate();
  const [salesStats, setSalesStats] = useState({
    totalRevenue: "L. 0",
    averageOrderValue: "L. 0",
    totalSales: "0",
    topCustomer: "N/A",
  });

  useEffect(() => {
    const fetchSalesStats = async () => {
      try {
        const response = await fetch('https://admin-dashboard-arca-backend.vercel.app/dashboard/salesStats', {
          method: 'GET',
          headers: { token: localStorage.token }
        });
        const data = await response.json();
        setSalesStats(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchSalesStats();
  }, [updateTrigger]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Venta de Material" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
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
            name='Ventas Totales'
            icon={TrendingUp}
            value={salesStats.totalSales}
            color='#F59E0B'
          />
          <StatCard name='Cliente mas Frecuente' icon={CreditCard} value={salesStats.topCustomer} color='#EF4444' />
        </motion.div>
        <VentasTable updateTrigger={updateTrigger} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SalesTable onSaleComplete={triggerUpdate} />
          <TipoMaterialesTable />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DonantesTable />
          <ClientsTable />
        </div>
        <SalesOverviewChart />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SalesByCategoryChart />
          <DailySalesTrend />
        </div>
      </main>
    </div>
  );
};
export default SalesPage;
