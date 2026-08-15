import { useEffect, useState } from "react";
import API_BASE from "../utils/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h1>Orders Dashboard</h1>
        <p>Luxury customer analytics</p>
      </div>

      {/* STATS */}
      <div style={styles.statsContainer}>
        <div style={styles.card}>
          <h3>Orders</h3>
          <h2>{orders.length}</h2>
        </div>

        <div style={styles.card}>
          <h3>Revenue</h3>
          <h2>${totalRevenue}</h2>
        </div>
      </div>

      {/* ORDERS */}
      <div style={styles.list}>
        {orders.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            No orders yet
          </p>
        ) : (
          orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              
              <div style={styles.row}>
                <h3>Order #{order._id.slice(-6)}</h3>
                <span style={styles.price}>${order.total}</span>
              </div>

              <div style={styles.items}>
                {order.items.map((item, i) => (
                  <div key={i}>
                    {item.name} - ${item.price}
                  </div>
                ))}
              </div>

              <small style={styles.date}>
                {new Date(order.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* 🎨 LUXURY STYLES */
const styles = {
  page: {
    padding: "30px",
    fontFamily: "Arial",
    background: "radial-gradient(circle at top, #0f0f0f, #000)",
    minHeight: "100vh",
    color: "white"
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
    letterSpacing: "2px"
  },

  statsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px"
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    padding: "20px",
    borderRadius: "15px",
    width: "160px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
  },

  list: {
    maxWidth: "800px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  orderCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
    transition: "0.3s ease",
    cursor: "pointer"
  },

  row: {
    display: "flex",
    justifyContent: "space-between"
  },

  price: {
    color: "#00ff99",
    fontWeight: "bold"
  },

  items: {
    marginTop: "10px",
    opacity: 0.9,
    fontSize: "14px"
  },

  date: {
    opacity: 0.6,
    display: "block",
    marginTop: "10px"
  }
};