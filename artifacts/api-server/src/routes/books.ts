import { Router } from "express";
import { db } from "@workspace/db";
import { booksTable } from "@workspace/db";

const router = Router();

// GET /books
router.get("/books", async (_req, res) => {
  const books = await db.select().from(booksTable);
  return res.json(books);
});

export default router;
