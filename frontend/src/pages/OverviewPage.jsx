import { motion } from "framer-motion";
import { BarChart2, Gift, ShoppingBag, Users } from "lucide-react";
import StatCard from "../components/common/StatCard";
import Header from "../components/common/Header";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import AIAssistant from "../components/common/AIAssistant";


const OverviewPage = () => {
  
  
  

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Vista General" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/*Stats*/}
        

        <motion.div
          className=" grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 2 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Donantes Totales"
            icon={Gift}
            value="5"
            color="#8366F1"
          />
          <StatCard
            name="Clientes Totales"
            icon={Users}
            value="10"
            color="#8B5CF6"
          />
          <StatCard
            name="Material Total"
            icon={ShoppingBag}
            value="325"
            color="#EC4899"
          />
          <StatCard
            name="Conversion a venta"
            icon={BarChart2}
            value="95%"
            color="#10B981"
          />
        </motion.div>
        
        <AIAssistant/>
        {/*Graphs*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
					<SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
