import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { Package, TrendingUp, Loader, PackageSearch } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import { useState, useEffect } from "react";

const ProductsPage = () => {
  const [stats, setStats] = useState({
    total_peso: 0,
    proceso_peso: 0,
    inventario_peso: 0,
    vendido_peso: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("https://admin-dashboard-arca-backend.vercel.app/dashboard/materialStats");
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Ingreso de Material' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard 
            name='Total Materiales Lb' 
            icon={Package} 
            value={loading ? '-' : Number(stats.total_peso).toFixed(2)} 
            color='#0000FF' 
          />
          <StatCard 
            name='En Inventario Lb' 
            icon={Loader} 
            value={loading ? '-' : Number(stats.proceso_peso).toFixed(2)} 
            color='#6366F1' 
          />
          <StatCard 
            name='En Proceso Lb' 
            icon={PackageSearch} 
            value={loading ? '-' : Number(stats.inventario_peso).toFixed(2)} 
            color='#F59E0B' 
          />
          <StatCard 
            name='Vendidos Lb' 
            icon={TrendingUp} 
            value={loading ? '-' : Number(stats.vendido_peso).toFixed(2)} 
            color='#10B981' 
          />
        </motion.div>
        
        <ProductsTable />

        {/* CHARTS */}
        <div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
          <SalesTrendChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;