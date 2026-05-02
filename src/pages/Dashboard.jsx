import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Bar } from "react-chartjs-2";
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
  const [stats, setStats] = useState({
    savings: 0,
    loans: 0,
    repayments: 0,
    balance: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("status", "approved");

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

    const chartData = {
  labels: ["Savings", "Loans", "Repayments"],
  datasets: [
    {
      label: "Amount ₹",
      data: [stats.savings, stats.loans, stats.repayments],
    },
  ],
};

    setStats({
      savings,
      loans,
      repayments,
      balance: loans - repayments,
    });
  };

  return (
  <div style={{ padding: "20px" }}>
    <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

    <div style={grid}>
      
      <div style={card}>
        <h4>💰 Savings</h4>
        <p style={amount}>₹{stats.savings}</p>
      </div>

      <div style={card}>
        <h4>📉 Loans</h4>
        <p style={amount}>₹{stats.loans}</p>
      </div>

      <div style={card}>
        <h4>💸 Repayments</h4>
        <p style={amount}>₹{stats.repayments}</p>
      </div>

      <div style={{ ...card, background: "#2563eb", color: "#fff" }}>
        <h4>📊 Balance</h4>
        <p style={{ ...amount, color: "#fff" }}>
          ₹{stats.balance}
        </p>
      </div>

      <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "12px" }}>
      <h3>Financial Overview</h3>
      <Bar data={chartData} />
</div>

    </div>
  </div>
);
  
}
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
  transition: "0.2s",
};

const amount = {
  fontSize: "22px",
  fontWeight: "bold",
  marginTop: "10px",
};