import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";

export default function Transactions() {
  const { groupId } = useParams();

  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [form, setForm] = useState({
    member_id: "",
    type: "saving",
    amount: "",
  });

  useEffect(() => {
    fetchMembers();
    fetchTransactions();
  }, []);

  // ✅ Fetch members
  const fetchMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("group_id", groupId);

    setMembers(data || []);
  };

  // ✅ Fetch transactions
  const fetchTransactions = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false });

    setTransactions(data || []);
  };

  // ✅ Add transaction (with approval flow)
  const addTransaction = async () => {
    if (!form.member_id || !form.amount) {
      alert("Please fill all fields");
      return;
    }

    const { data: group } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    const { error } = await supabase.from("transactions").insert([
      {
        group_id: groupId,
        member_id: form.member_id,
        type: form.type,
        amount: Number(form.amount),
        status: "pending",
        level1_approved: false,
        level2_approved: false,
        approver1: group.approver1,
        approver2: group.approver2,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error adding transaction");
      return;
    }

    setForm({ member_id: "", type: "saving", amount: "" });
    fetchTransactions();
  };

  return (
    <AnimatedPage>
      <div style={container}>
        <h2>Transactions</h2>

        {/* Form */}
        <div style={card}>
          <select
            style={input}
            value={form.member_id}
            onChange={(e) =>
              setForm({ ...form, member_id: e.target.value })
            }
          >
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            style={input}
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="saving">Saving</option>
            <option value="loan">Loan</option>
            <option value="repayment">Repayment</option>
          </select>

          <input
            style={input}
            placeholder="Amount"
            type="number"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <button style={button} onClick={addTransaction}>
            Add Transaction
          </button>
        </div>

        {/* List */}
        <div style={{ marginTop: "20px" }}>
          {transactions.map((t) => (
            <motion.div
              key={t.id}
              style={card}
              whileHover={{ scale: 1.02 }}
            >
              <p><strong>Type:</strong> {t.type}</p>
              <p><strong>Amount:</strong> ₹{t.amount}</p>
              <p>
                <strong>Status:</strong>{" "}
                {t.level2_approved
                  ? "Approved"
                  : t.level1_approved
                  ? "Waiting Level 2"
                  : "Waiting Level 1"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(t.created_at).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
}

/* Styles */

const container = {
  maxWidth: "420px",
  margin: "auto",
  padding: "15px",
};

const card = {
  padding: "15px",
  background: "#fff",
  borderRadius: "10px",
  marginTop: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "10px",
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
};