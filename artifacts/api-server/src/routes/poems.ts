import { Router } from "express";
import { db } from "@workspace/db";
import { poemsTable } from "@workspace/db";
import { eq, desc, asc, ilike, or } from "drizzle-orm";

const router = Router();

// GET /poems
router.get("/poems", async (req, res) => {
  const { search, sort, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

  let query = db.select().from(poemsTable).$dynamic();

  if (search) {
    query = query.where(or(ilike(poemsTable.title, `%${search}%`), ilike(poemsTable.author, `%${search}%`)));
  }

  if (sort === "popular") {
    query = query.orderBy(desc(poemsTable.averageRating));
  } else if (sort === "alphabetical") {
    query = query.orderBy(asc(poemsTable.author));
  } else {
    query = query.orderBy(desc(poemsTable.publishedAt));
  }

  const poems = await query.limit(limitNum).offset((pageNum - 1) * limitNum);

  return res.json(poems.map(p => ({
    ...p,
    averageRating: parseFloat(p.averageRating?.toString() ?? "0"),
  })));
});

// GET /poems/featured
router.get("/poems/featured", async (_req, res) => {
  const poems = await db
    .select()
    .from(poemsTable)
    .where(eq(poemsTable.isFeatured, true))
    .orderBy(desc(poemsTable.publishedAt))
    .limit(5);
  return res.json(poems.map(p => ({
    ...p,
    averageRating: parseFloat(p.averageRating?.toString() ?? "0"),
  })));
});

// GET /poems/:id
router.get("/poems/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [poem] = await db.select().from(poemsTable).where(eq(poemsTable.id, id));
  if (!poem) return res.status(404).json({ error: "Not found" });

  return res.json({ ...poem, averageRating: parseFloat(poem.averageRating?.toString() ?? "0") });
});

// POST /poems/:id/rate
router.post("/poems/:id/rate", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const stars = parseInt(req.body?.stars, 10);
  if (isNaN(stars) || stars < 1 || stars > 5) {
    return res.status(400).json({ error: "Stars must be 1-5" });
  }

  const [existing] = await db.select().from(poemsTable).where(eq(poemsTable.id, id));
  if (!existing) return res.status(404).json({ error: "Not found" });

  const newSum = (existing.ratingSum ?? 0) + stars;
  const newCount = (existing.ratingCount ?? 0) + 1;
  const newAvg = (newSum / newCount).toFixed(2);

  const [updated] = await db
    .update(poemsTable)
    .set({ ratingSum: newSum, ratingCount: newCount, averageRating: newAvg })
    .where(eq(poemsTable.id, id))
    .returning();

  return res.json({ ...updated, averageRating: parseFloat(updated.averageRating?.toString() ?? "0") });
});

export default router;
