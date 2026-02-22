require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../db/connect");

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = "mark.potot2004@gmail.com";
        const adminPassword = "Makoy20042";

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            // Promote to admin if not already
            if (!existingAdmin.isAdmin) {
                existingAdmin.isAdmin = true;
                await existingAdmin.save();
                console.log(`User "${existingAdmin.username}" promoted to admin.`);
            } else {
                console.log(`Admin user already exists: ${adminEmail}`);
            }

            // Re-hash password if it's still plaintext (migration)
            const isHashed =
                existingAdmin.password.startsWith("$2a$") ||
                existingAdmin.password.startsWith("$2b$");
            if (!isHashed) {
                console.log("Migrating plaintext password to bcrypt hash...");
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(existingAdmin.password, salt);
                await User.updateOne(
                    { _id: existingAdmin._id },
                    { $set: { password: hashedPassword } },
                );
                console.log("Password has been hashed successfully.");
            }
        } else {
            // Create new admin user (password auto-hashed by pre-save hook)
            const admin = await User.create({
                username: "Admin",
                email: adminEmail,
                password: adminPassword,
                role: "Administrator",
                isAdmin: true,
            });

            console.log(`Admin user created successfully!`);
            console.log(`   Email:    ${admin.email}`);
            console.log(`   Password: ${adminPassword}`);
        }

        await mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error.message);
        process.exit(1);
    }
};

seedAdmin();
