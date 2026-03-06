/**
 * Seed script: Populate order book (trades) and historical transactions
 * for all 6 properties to simulate a liquid market.
 *
 * Run: node seed_market_data.js
 *
 * Logic:
 * - Each property has a base price (1000-1500 SAR range, unique per property)
 * - Bid orders are BELOW the base price (buyers want to buy cheap)
 * - Ask orders are ABOVE the base price (sellers want to sell high)
 * - Historical transactions are completed trades at prices near base price
 * - Chart data mirrors historical transactions for the price chart
 */

require("dotenv").config();
const mongoose = require("mongoose");

// ─── Models ────────────────────────────────────────────────────────────────────
const Trade = require("./Model/tradeModel");
const Transaction = require("./Model/transactionModel");
const ChartData = require("./Model/chartDataModel");

// ─── Property config ───────────────────────────────────────────────────────────
// Each property gets a unique base price in the 1000-1500 range
const PROPERTIES = [
  { id: "69a97fc4b87387d85b6ddba6", name: "Al Narjes Residential Complex",        basePrice: 1000 },
  { id: "69a97fc4b87387d85b6ddba7", name: "King Fahd District Office Tower",       basePrice: 1150 },
  { id: "69a97fc4b87387d85b6ddba8", name: "Al Olaya Mixed-Use Development",        basePrice: 1250 },
  { id: "69a97fc4b87387d85b6ddba9", name: "Diplomatic Quarter Luxury Residences",  basePrice: 1400 },
  { id: "69a97fc4b87387d85b6ddbaa", name: "Al Malqa Premium Office Complex",       basePrice: 1100 },
  { id: "69a97fc4b87387d85b6ddbab", name: "Granada Residential Towers",            basePrice: 1050 },
];

// Fake user IDs for market participants (not real users — just for display)
const MARKET_USERS = [
  "market_user_001",
  "market_user_002",
  "market_user_003",
  "market_user_004",
  "market_user_005",
  "market_user_006",
];

function randomUser() {
  return MARKET_USERS[Math.floor(Math.random() * MARKET_USERS.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundTo(val, step) {
  return Math.round(val / step) * step;
}

// ─── Generate order book entries ───────────────────────────────────────────────
// Bids: 3-5 levels below base price (e.g. base-5, base-10, base-15...)
// Asks: 3-5 levels above base price (e.g. base+5, base+10, base+15...)
function generateOrderBook(prop) {
  const trades = [];
  const base = prop.basePrice;

  // BID side (buyers) — prices below base
  const bidLevels = [5, 10, 15, 20, 30];
  bidLevels.forEach((offset) => {
    const price = roundTo(base - offset, 5);
    const units = randomInt(2, 15);
    trades.push({
      propertyId: prop.id,
      userId: randomUser(),
      units,
      price,
      priceType: "limit",
      action: "buy",
      isOpen: true,
    });
  });

  // ASK side (sellers) — prices above base
  const askLevels = [5, 10, 15, 25, 40];
  askLevels.forEach((offset) => {
    const price = roundTo(base + offset, 5);
    const units = randomInt(2, 12);
    trades.push({
      propertyId: prop.id,
      userId: randomUser(),
      units,
      price,
      priceType: "limit",
      action: "sell",
      isOpen: true,
    });
  });

  return trades;
}

// ─── Generate historical transactions + chart data ─────────────────────────────
// 15-25 completed trades spread over the past 60 days
function generateHistory(prop) {
  const transactions = [];
  const chartPoints = [];
  const base = prop.basePrice;
  const now = Date.now();
  const sixtyDays = 60 * 24 * 60 * 60 * 1000;
  const count = randomInt(18, 25);

  // Sort timestamps ascending so chart looks natural
  const timestamps = Array.from({ length: count }, () =>
    now - Math.floor(Math.random() * sixtyDays)
  ).sort((a, b) => a - b);

  // Price walks randomly around base (±8% max drift)
  let currentPrice = base;
  timestamps.forEach((ts) => {
    // Small random walk: ±1% per step
    const drift = (Math.random() - 0.48) * base * 0.015;
    currentPrice = roundTo(
      Math.max(base * 0.92, Math.min(base * 1.08, currentPrice + drift)),
      5
    );
    const units = randomInt(1, 8);
    const action = Math.random() > 0.5 ? "buy" : "sell";

    transactions.push({
      propertyId: prop.id,
      userId: randomUser(),
      units,
      price: currentPrice,
      action,
      isSubscription: false,
      createdAt: new Date(ts),
      updatedAt: new Date(ts),
    });

    chartPoints.push({
      propertyId: prop.id,
      time: ts,
      price: currentPrice,
      createdAt: new Date(ts),
      updatedAt: new Date(ts),
    });
  });

  return { transactions, chartPoints };
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected.");

  // Clear existing seeded market data (keep real user data)
  console.log("Clearing existing market seed data...");
  await Trade.deleteMany({ userId: { $in: MARKET_USERS } });
  await Transaction.deleteMany({ userId: { $in: MARKET_USERS } });
  await ChartData.deleteMany({
    propertyId: { $in: PROPERTIES.map((p) => p.id) },
  });
  console.log("Cleared.");

  for (const prop of PROPERTIES) {
    console.log(`\nSeeding: ${prop.name} (base price: ${prop.basePrice} SAR)`);

    // Order book
    const orderBook = generateOrderBook(prop);
    await Trade.insertMany(orderBook);
    console.log(
      `  ✓ ${orderBook.filter((t) => t.action === "buy").length} bid orders, ` +
      `${orderBook.filter((t) => t.action === "sell").length} ask orders`
    );

    // Historical transactions + chart data
    const { transactions, chartPoints } = generateHistory(prop);
    await Transaction.insertMany(transactions);
    await ChartData.insertMany(chartPoints);
    console.log(
      `  ✓ ${transactions.length} historical transactions, ${chartPoints.length} chart data points`
    );
  }

  console.log("\n✅ Seeding complete!");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
