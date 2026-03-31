const express = require("express");
const app = express();

app.use(express.json());

// Webhook SePay
app.post("/api/webhooks/payment", (req, res) => {
  console.log("=== NHẬN THANH TOÁN ===");
  console.log(req.body);

  res.status(200).json({ ok: true });
});

// Test trình duyệt
app.get("/api/webhooks/payment", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));