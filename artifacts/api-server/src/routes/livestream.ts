import { Router } from "express";
import { db } from "@workspace/db";
import { livestreamSessionsTable, livestreamStatusTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

// GET /livestream
router.get("/livestream", async (_req, res) => {
  const [status] = await db.select().from(livestreamStatusTable).limit(1);
  if (!status) {
    return res.json({
      isLive: false,
      viewerCount: 0,
      title: "Loudthotz Virtual Open Readings",
      description: "Monthly poetry open readings hosted under Naija Art Initiative",
      season: "Season 14",
      episode: 10,
      streamUrl: null,
      embedUrl: null,
      scheduledAt: null,
    });
  }
  return res.json({
    ...status,
    scheduledAt: status.scheduledAt?.toISOString() ?? null,
  });
});

// GET /livestream/sessions
router.get("/livestream/sessions", async (_req, res) => {
  const sessions = await db
    .select()
    .from(livestreamSessionsTable)
    .orderBy(desc(livestreamSessionsTable.date))
    .limit(20);
  return res.json(sessions.map(s => ({ ...s, date: s.date.toISOString() })));
});

export default router;
