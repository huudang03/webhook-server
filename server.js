const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 FIX CORS (QUAN TRỌNG)
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

  const amount = parseFloat(
    data.amount ||
    data.transferAmount ||
    data.value ||
    0
  );

  const content = (data.content || "").toUpperCase();

  console.log("=== NHẬN WEBHOOK ===");
  console.log("Content:", content);
  console.log("Amount:", amount);

  // 🔥 TÁCH MÃ HDxxxTxx TỪ NỘI DUNG
  const match = content.match(/HD\d+T\d+/);

  if (match) {
    const code = match[0];
    paymentStatus[code] = "paid";

    console.log("🔥 ĐÃ THANH TOÁN:", code);
  } else {
    console.log("❌ Không tìm thấy mã HD trong nội dung");
  }

  return res.json({ ok: true });
});

// ==========================
// ✅ API KIỂM TRA THANH TOÁN
// ==========================
app.get("/api/check-payment/:code", (req, res) => {
  const code = req.params.code.toUpperCase();

  const status = paymentStatus[code] || "pending";

  console.log("🔎 CHECK:", code, "=>", status);

  res.json({ status });
});

// ==========================
// ✅ TEST WEBHOOK (TRÌNH DUYỆT)
// ==========================
app.get("/api/webhooks/payment", (req, res) => {
  res.send("OK");
});

// ==========================
// 🚀 CHẠY SERVER
// ==========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
