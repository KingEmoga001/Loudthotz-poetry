import { Router } from "express";
import { db } from "@workspace/db";
import { submissionsTable, poemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /submissions (admin)
router.get("/submissions", async (_req, res) => {
  const submissions = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.status, "pending"))
    .orderBy(submissionsTable.submittedAt);
  return res.json(submissions);
});

// POST /submissions
router.post("/submissions", async (req, res) => {
  const { title, author, country, content } = req.body ?? {};
  if (!title || !author || !country || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (content.length < 10) {
    return res.status(400).json({ error: "Poem content too short" });
  }

  const [submission] = await db
    .insert(submissionsTable)
    .values({ title, author, country, content })
    .returning();

  return res.status(201).json(submission);
});

// POST /submissions/:id/approve
router.post("/submissions/:id/approve", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [submission] = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.id, id));

  if (!submission) return res.status(404).json({ error: "Not found" });

  await db
    .update(submissionsTable)
    .set({ status: "approved" })
    .where(eq(submissionsTable.id, id));

  const [poem] = await db
    .insert(poemsTable)
    .values({
      title: submission.title,
      author: submission.author,
      country: submission.country,
      content: submission.content,
      isFeatured: false,
    })
    .returning();

  return res.json({ ...poem, averageRating: parseFloat(poem.averageRating?.toString() ?? "0") });
});

// POST /submissions/:id/reject
router.post("/submissions/:id/reject", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [submission] = await db
    .update(submissionsTable)
    .set({ status: "rejected" })
    .where(eq(submissionsTable.id, id))
    .returning();

  if (!submission) return res.status(404).json({ error: "Not found" });

  return res.json(submission);
});

export default router;
