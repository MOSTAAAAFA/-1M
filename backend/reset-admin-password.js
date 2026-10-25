const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

// 🔧 تغيير هذه الكلمة إلى كلمة المرور الجديدة التي تريدها
const NEW_PASSWORD = "admin m1";

async function resetAdminPassword() {
    try {
        console.log("🔗 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        // البحث عن حساب الأدمن
        const admin = await User.findOne({ email: "admin@1mmotors.com" });

        if (!admin) {
            console.log("❌ Admin user not found!");
            process.exit(1);
        }

        console.log(`📝 Found admin: ${admin.name} (${admin.email})`);
        console.log(`🔄 Resetting password to: ${NEW_PASSWORD}\n`);

        // تشفير كلمة المرور الجديدة
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);

        // تحديث كلمة المرور
        admin.password = hashedPassword;
        admin.updatedAt = new Date();
        await admin.save();

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("✅ Password reset successfully!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        console.log("📝 NEW LOGIN CREDENTIALS:");
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${NEW_PASSWORD}`);
        console.log("\n⚠️  IMPORTANT: Change NEW_PASSWORD variable in this script before running!\n");

        await mongoose.connection.close();
        console.log("✅ Database connection closed");

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

resetAdminPassword();
