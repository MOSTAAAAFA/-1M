const mongoose = require("mongoose");
require("dotenv").config();

const Order = require("./models/Order");

async function backfillOrders() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const orders = await Order.find({});
    let updated = 0;

    for (const order of orders) {
      let changed = false;

      if (!order.status) {
        order.status = "pending";
        changed = true;
      }

      if (Array.isArray(order.items)) {
        const normalized = order.items.map((item) => {
          if (typeof item !== "object" || item === null) {
            return item;
          }
          const next = { ...item };
          if (!next.product) {
            next.product = item.id || item._id || undefined;
          }
          if (next.id) delete next.id;
          if (!next.quantity) next.quantity = 1;
          return next;
        });
        const jsonChanged = JSON.stringify(normalized) !== JSON.stringify(order.items);
        if (jsonChanged) {
          order.items = normalized;
          changed = true;
        }
      }

      if (changed) {
        await order.save();
        updated++;
      }
    }

    console.log(`✅ Backfilled ${updated}/${orders.length} orders (status + normalized items)`);

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

backfillOrders();