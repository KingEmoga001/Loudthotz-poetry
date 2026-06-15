import { Router } from "express";
import { db } from "@workspace/db";
import { poemsTable, submissionsTable, livestreamSessionsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

// GET /stats
router.get("/stats", async (_req, res) => {
  const [poemStats] = await db
    .select({
      totalPoems: sql<number>`count(*)::int`,
      totalPoets: sql<number>`count(distinct ${poemsTable.author})::int`,
      totalCountries: sql<number>`count(distinct ${poemsTable.country})::int`,
    })
    .from(poemsTable);

  const [sessionStats] = await db
    .select({ totalSessions: sql<number>`count(*)::int` })
    .from(livestreamSessionsTable);

  return res.json({
    totalPoems: poemStats?.totalPoems ?? 0,
    totalPoets: poemStats?.totalPoets ?? 0,
    totalCountries: poemStats?.totalCountries ?? 0,
    totalSessions: sessionStats?.totalSessions ?? 0,
    upcomingEventTitle: "Brothers — Spotlights on Kinship",
    upcomingEventDate: null,
  });
});

export default router;
