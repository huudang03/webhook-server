const express = require("express");
const app = express();

app.use(express.json());

// 🔥 Lưu trạng thái thanh toán (tạm thời - dùng cho đồ án)
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

  // 👉 Nếu có mã thì đánh dấu đã thanh toán
  if (code) {
    paymentStatus[code] = "paid";
    console.log("🔥 ĐÃ THANH TOÁN:", code);
  }

  res.json({ ok: true });
});

// ==========================
// ✅ API KIỂM TRA THANH TOÁN
// ==========================
app.get("/api/check-payment/:code", (req, res) => {
  const code = req.params.code.toUpperCase();

  res.json({
    status: paymentStatus[code] || "pending"
  });
});

// ==========================
// ✅ TEST TRÌNH DUYỆT
// ==========================
app.get("/api/webhooks/payment", (req, res) => {
  res.send("OK");
});

// ==========================
// 🚀 RUN SERVER
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
