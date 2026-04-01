const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 FIX CORS (QUAN TRỌNG NHẤT)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 🔥 Lưu trạng thái thanh toán
let paymentStatus = {};

// ==========================
// ✅ WEBHOOK NHẬN THANH TOÁN
// ==========================
app.post("/api/webhooks/payment", (req, res) => {
  const data = req.body;

  const code = (data.code || "").toUpperCase();
  const amount = parseFloat(
    data.amount ||
    data.transferAmount ||
    data.value ||
    0
  );

  console.log("=== NHẬN THANH TOÁN ===");
  console.log("Code:", code);
  console.log("Amount:", amount);

  if (code) {
    paymentStatus[code] = "paid";
    console.log("🔥 ĐÃ THANH TOÁN:", code);
  }

  res.json({ ok: true });
});

// ==========================
// ✅ API KIỂM TRA
// ==========================
app.get("/api/check-payment/:code", (req, res) => {
  const code = req.params.code.toUpperCase();

  res.json({
    status: paymentStatus[code] || "pending"
  });
});

// ==========================
// ✅ TEST
// ==========================
app.get("/api/webhooks/payment", (req, res) => {
  res.send("OK");
});

// ==========================
// 🚀 RUN
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
