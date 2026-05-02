import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const { groupId } = useParams(); // ✅ get groupId

  const [stats, setStats] = useState({
    savings: 0,
    loans: 0,
    repayments: 0,
    balance: 0,
  });

  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (groupId) {
      fetchData();
      fetchGroup();
    }
  }, [groupId]);

  // ✅ Fetch group name
  const fetchGroup = async () => {
    const { data } = await supabase
      .from("groups")
      .select("name")
      .eq("id", groupId)
      .single();

    if (data) {
      setGroupName(data.name);
    }
  };

  // ✅ Fetch transactions filtered by group
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("status", "approved")
      .eq("group_id", groupId); // ✅ filter by group

    if (error) {
      console.error(error);
      return;
    }

    let savings = 0;
    let loans = 0;
    let repayments = 0;

    (data || []).forEach((t) => {
      if (t.type === "saving") savings += t.amount;
      if (t.type === "loan") loans += t.amount;
      if (t.type === "repayment") repayments += t.amount;
    });

    setStats({
      savings,
      loans,
      repayments,
      balance: loans - repayments,
    });
  };

  const chartData = {
    labels: ["Savings", "Loans", "Repayments"],
    datasets: [
      {
        label: "Amount ₹",
        data: [stats.savings, stats.loans, stats.repayments],
      },
    ],
  };

  return (
    <AnimatedPage>
      <div style={container}>
        <h2 style={{ marginBottom: "10px" }}>Dashboard</h2>

        {/* ✅ Show Group Name */}
        <p style={{ color: "#555", marginBottom: "20px" }}>
          {groupName ? `Group: ${groupName}` : "Loading..."}
        </p>

        <div style={grid}>
          <motion.div whileHover={{ scale: 1.03 }} style={card}>
            <h4>💰 Savings</h4>
            <p style={amount}>₹{stats.savings}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} style={card}>
            <h4>📉 Loans</h4>
            <p style={amount}>₹{stats.loans}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} style={card}>
            <h4>💸 Repayments</h4>
            <p style={amount}>₹{stats.repayments}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            style={{ ...card, background: "#2563eb", color: "#fff" }}
          >
            <h4>📊 Balance</h4>
            <p style={{ ...amount, color: "#fff" }}>₹{stats.balance}</p>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={chartBox}
        >
          <h3>Financial Overview</h3>
          <Bar data={chartData} />
        </motion.div>
      </div>
    </AnimatedPage>
  );
}

/* Styles */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
};

const card = {
  padding: "20px",
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const amount = {
  fontSize: "22px",
  fontWeight: "bold",
  marginTop: "10px",
};

const container = {
  maxWidth: "420px",
  margin: "auto",
  padding: "15px",
};

const chartBox = {
  marginTop: "30px",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
};