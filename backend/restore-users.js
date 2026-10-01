const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const restore = [
  { _id: new mongoose.Types.ObjectId("6ab66b191e24a6ba49b1e60c"), name: "SASA",  email: "HOHEWE20@GMAIL.COM",  createdAt: new Date("2026-09-25T12:37:45.745Z") },
  { _id: new mongoose.Types.ObjectId("6aa6e69bd8e2471e2365036e"), name: "YOUSSEF", email: "youssefali9866@gmail.com", createdAt: new Date("2026-09-13T18:08:27.896Z") },
  { _id: new mongoose.Types.ObjectId("6a676f5bb6a189cec37c2bfb"), name: "mostafa", email: "hohew11e20@gmail.com",    createdAt: new Date("2026-07-27T14:46:51.351Z") },
];
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash("SasaTemp@123", 12);
  let restored = 0;
  for (const r of restore) {
    const existing = await User.findById(r._id);
    if (!existing) {
      const created = await User.create({ ...r, password: hash, phone: "", isActive: true });
      restored++;
      console.log("RESTORED", created.email, created._id);
    } else {
      console.log("SKIP (already exists)", r.email);
    }
  }
  console.log("restored total:", restored);
  const all = await User.find().select("name email isAdmin");
  console.log("users now:", all.length, all.map(u => u.email).join(", "));
  await mongoose.connection.close();
})().catch(e => { console.error("ERR", e.message); process.exit(1); });
