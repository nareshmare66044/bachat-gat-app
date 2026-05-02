import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import AnimatedPage from "../components/AnimatedPage";
import { motion } from "framer-motion";

export default function Approvals() {
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    fetchUser();
    fetchPending();
  }, []);

  // ✅ Get logged-in user
  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setCurrentUser(data.user.id);
    }
  };

  // ✅ Fetch pending transactions
  const fetchPending = async () => {
    const { data } = await supabase
      .from("transactions")
      .select(`
        id,
        type,
        amount,
        status,
        level1_approved,
        level2_approved,
        approver1,
        approver2,
        members(name),
        groups(name)
      `)
      .eq("status", "pending");

    setTransactions(data || []);
  };

  // ✅ Approval logic
  const approve = async (t) => {
    // Level 1
    if (!t.level1_approved && currentUser === t.approver1) {
      await supabase
        .from("transactions")
        .update({ level1_approved: true })
        .eq("id", t.id);
    }

    // Level 2
    else if (
      t.level1_approved &&
      !t.level2_approved &&
      currentUser === t.approver2
    ) {
      await supabase
        .from("transactions")
        .update({
          level2_approved: true,
          status: "approved",
        })
        .eq("id", t.id);
    } else {
      alert("Not authorized");
    }

    fetchPending();
  };

  return (
    <AnimatedPage>
      <div style={container}>
        <h2>Pending Approvals</h2>

        {transactions.length === 0 ? (
          <p>No pending transactions</p>
        ) : (
          transactions.map((t) => (
            <motion.div
              key={t.id}
              style={card}
              whileHover={{ scale: 1.02 }}
            >
              <h4>{t.groups?.name}</h4>
              <p>Member: {t.members?.name}</p>
              <p>Type: {t.type}</p>
              <p>Amount: ₹{t.amount}</p>

              <p>
                Status:{" "}
                {t.level2_approved
                  ? "Approved"
                  : t.level1_approved
                  ? "Waiting Level 2"
                  : "Waiting Level 1"}
              </p>

              <button
                style={button}
                onClick={() => approve(t)}
                disabled={
                  (!t.level1_approved && currentUser !== t.approver1) ||
                  (t.level1_approved && currentUser !== t.approver2)
                }
              >
                Approve
              </button>
            </motion.div>
          ))
        )}
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
  marginTop: "10px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const button = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
};