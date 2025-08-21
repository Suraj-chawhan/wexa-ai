import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import KB from "./models/KB.js";
import Ticket from "./models/Ticket.js";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/helpdesk";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to DB");

  // Clear collections
  await User.deleteMany({});
  await KB.deleteMany({});
  await Ticket.deleteMany({});

  // Create users with emails & passwords
  const admin = await User.create({
    email: "admin@example.com",
    passwordHash: await bcrypt.hash("admin123", 10), // password: admin123
    name: "Admin",
    isAdmin: true
  });

  const agent = await User.create({
    email: "agent@example.com",
    passwordHash: await bcrypt.hash("agent123", 10), // password: agent123
    name: "Agent",
    isHumanAgent: true
  });

  const user1 = await User.create({
    email: "user1@example.com",
    passwordHash: await bcrypt.hash("user123", 10), // password: user123
    name: "User One"
  });

  const user2 = await User.create({
    email: "user2@example.com",
    passwordHash: await bcrypt.hash("user123", 10), // password: user123
    name: "User Two"
  });

  // Seed KB (only admin can post KB)
  await KB.insertMany([
    { title: "Update Payment Method", body: "Go to billing page and update card info", tags: ["billing"] },
    { title: "Fix Login Error", body: "Clear cookies & retry login", tags: ["tech"] },
    { title: "Track Shipment", body: "Use the tracking link from your order email", tags: ["shipping"] }
  ]);

  // Seed tickets created by regular users
  await Ticket.insertMany([
    { 
      title: "Refund needed", 
      description: "I was charged twice for the same order", 
      userId: user1._id, 
      status: "open", 
      draft: "", 
      category: "", 
      confidence: 0 
    },
    { 
      title: "App crash", 
      description: "App crashes when I try to login", 
      userId: user1._id, 
      status: "open", 
      draft: "", 
      category: "", 
      confidence: 0 
    },
    { 
      title: "Where is package", 
      description: "My delivery is late", 
      userId: user2._id, 
      status: "open", 
      draft: "", 
      category: "", 
      confidence: 0 
    }
  ]);

  console.log(`
✅ Seeded:
- Admin → email: admin@example.com, password: admin123
- Agent → email: agent@example.com, password: agent123
- User1 → email: user1@example.com, password: user123
- User2 → email: user2@example.com, password: user123
- KB articles: 3
- Tickets: 3
  `);

  process.exit(0);
}

seed();
