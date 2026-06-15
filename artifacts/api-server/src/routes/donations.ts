import { Router } from "express";

const router = Router();

// POST /donations/initiate
router.post("/donations/initiate", async (req, res) => {
  const { amount, name, message } = req.body ?? {};
  if (!amount || isNaN(parseFloat(amount))) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  const reference = `LTHOTZ-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return res.json({
    success: true,
    message: `Thank you${name ? ", " + name : ""}! Your generous donation of $${parseFloat(amount).toFixed(2)} supports the Loudthotz community. Reference: ${reference}`,
    reference,
  });
});

export default router;
