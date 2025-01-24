import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, Gift, ShoppingBag, Users } from "lucide-react";
import StatCard from "../components/common/StatCard";
import Header from "../components/common/Header";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import AIAssistant from "../components/common/AIAssistant";


const OverviewPage = () => {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalClients: 0,
    totalMaterial: 0,
    conversionRate: 0
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("https://admin-dashboard-arca-backend.vercel.app/dashboard/stats", {
          method: "GET",
          headers: { token: localStorage.token }
        });
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    
    fetchStats();
  }, []);
  

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Vista General" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 2 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Donantes Totales"
            icon={Gift}
            value={stats.totalDonors.toString()}
            color="#8366F1"
          />
          <StatCard
            name="Clientes Totales"
            icon={Users}
            value={stats.totalClients.toString()}
            color="#8B5CF6"
          />
          <StatCard
            name="Material Total (lb)"
            icon={ShoppingBag}
            value={stats.totalMaterial.toFixed(2)}
            color="#EC4899"
          />
          <StatCard
            name="Conversion a venta"
            icon={BarChart2}
            value={`${stats.conversionRate}%`}
            color="#10B981"
          />
        </motion.div>
        
        <AIAssistant/>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
