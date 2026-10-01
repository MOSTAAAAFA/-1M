const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function getAdminUsers() {
    try {
        console.log("🔗 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        // البحث عن جميع المستخدمين الأدمن
        const admins = await User.find({ isAdmin: true }).select("-__v");

        if (admins.length === 0) {
            console.log("⚠️  No admin users found in database!");
            console.log("\nTo create an admin user, you can:");
            console.log("1. Register a new user via the frontend");
            console.log("2. Then run this command in MongoDB:");
            console.log('   db.users.updateOne({email: "your-email@example.com"}, {$set: {isAdmin: true}})');
        } else {
            console.log(`🔐 Found ${admins.length} admin user(s):\n`);
            admins.forEach((admin, index) => {
                console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                console.log(`Admin #${index + 1}:`);
                console.log(`  ID: ${admin._id}`);
                console.log(`  Name: ${admin.name}`);
                console.log(`  Email: ${admin.email}`);
                console.log(`  Phone: ${admin.phone || 'N/A'}`);
                console.log(`  isAdmin: ${admin.isAdmin}`);
                console.log(`  Created: ${admin.createdAt}`);
                console.log(`  Updated: ${admin.updatedAt}`);
                console.log(`  Password Hash: ${admin.password.substring(0, 30)}...`);
                console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
            });

            console.log("\n📝 LOGIN CREDENTIALS (Use these to login):");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            admins.forEach((admin, index) => {
                console.log(`\nAdmin #${index + 1}:`);
                console.log(`  Email: ${admin.email}`);
                console.log(`  Password: [You need to know the password you registered with]`);
            });
            console.log("\n⚠️  Note: Passwords are hashed with bcrypt and cannot be retrieved.");
            console.log("   If you forgot the password, you need to reset it in the database.");
        }

        await mongoose.connection.close();
        console.log("\n✅ Database connection closed");

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

getAdminUsers();
