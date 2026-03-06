/**
 * One-time seed route for market data.
 * POST /api/seed-market-data?key=treasury_seed_2026
 * Deletes and re-inserts order book + historical transactions for all properties.
 */
const router = require("express").Router();
const Trade = require("../Model/tradeModel");
const Transaction = require("../Model/transactionModel");
const ChartData = require("../Model/chartDataModel");

const SEED_KEY = "treasury_seed_2026";

const PROPERTIES = [
  { id: "69a97fc4b87387d85b6ddba6", basePrice: 1000 },
  { id: "69a97fc4b87387d85b6ddba7", basePrice: 1150 },
  { id: "69a97fc4b87387d85b6ddba8", basePrice: 1250 },
  { id: "69a97fc4b87387d85b6ddba9", basePrice: 1400 },
  { id: "69a97fc4b87387d85b6ddbaa", basePrice: 1100 },
  { id: "69a97fc4b87387d85b6ddbab", basePrice: 1050 },
];

const MARKET_USERS = [
  "market_user_001", "market_user_002", "market_user_003",
  "market_user_004", "market_user_005", "market_user_006",
];

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function snap(v, step) { return Math.round(v / step) * step; }
function rndUser() { return MARKET_USERS[Math.floor(Math.random() * MARKET_USERS.length)]; }

function buildOrderBook(prop) {
  const trades = [];
  const b = prop.basePrice;
  // 5 bid levels below base price
  [5, 10, 15, 20, 30].forEach(off => {
    trades.push({ propertyId: prop.id, userId: rndUser(), units: rnd(2,15), price: snap(b - off, 5), priceType: "limit", action: "buy",  isOpen: true });
  });
  // 5 ask levels above base price
  [5, 10, 15, 25, 40].forEach(off => {
    trades.push({ propertyId: prop.id, userId: rndUser(), units: rnd(2,12), price: snap(b + off, 5), priceType: "limit", action: "sell", isOpen: true });
  });
  return trades;
}

function buildHistory(prop) {
  const txns = [], chart = [];
  const b = prop.basePrice;
  const now = Date.now();
  const count = rnd(20, 28);
  const tsList = Array.from({ length: count }, () => now - Math.floor(Math.random() * 60 * 86400000)).sort((a,b) => a - b);
  let price = b;
  tsList.forEach(ts => {
    price = snap(Math.max(b * 0.92, Math.min(b * 1.08, price + (Math.random() - 0.48) * b * 0.015)), 5);
    const units = rnd(1, 8);
    const action = Math.random() > 0.5 ? "buy" : "sell";
    txns.push({ propertyId: prop.id, userId: rndUser(), units, price, action, isSubscription: false, createdAt: new Date(ts), updatedAt: new Date(ts) });
    chart.push({ propertyId: prop.id, time: ts, price, createdAt: new Date(ts), updatedAt: new Date(ts) });
  });
  return { txns, chart };
}

router.post("/seed-market-data", async (req, res) => {
  if (req.query.key !== SEED_KEY) return res.status(403).json({ error: "Forbidden" });
  try {
    // Clear previous seed data
    await Trade.deleteMany({ userId: { $in: MARKET_USERS } });
    await Transaction.deleteMany({ userId: { $in: MARKET_USERS } });
    await ChartData.deleteMany({ propertyId: { $in: PROPERTIES.map(p => p.id) } });

    const summary = [];
    for (const prop of PROPERTIES) {
      const orders = buildOrderBook(prop);
      await Trade.insertMany(orders);
      const { txns, chart } = buildHistory(prop);
      await Transaction.insertMany(txns);
      await ChartData.insertMany(chart);
      summary.push({ propertyId: prop.id, basePrice: prop.basePrice, orders: orders.length, transactions: txns.length, chartPoints: chart.length });
    }
    res.json({ success: true, summary });
  } catch (err) {
    console.error("Seed error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
