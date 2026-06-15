import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const livestreamSessionsTable = pgTable("livestream_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  season: text("season").notNull(),
  episode: integer("episode").notNull(),
  recordingUrl: text("recording_url"),
  theme: text("theme").notNull(),
});

export const insertLivestreamSessionSchema = createInsertSchema(livestreamSessionsTable).omit({ id: true });
export type InsertLivestreamSession = z.infer<typeof insertLivestreamSessionSchema>;
export type LivestreamSession = typeof livestreamSessionsTable.$inferSelect;

export const livestreamStatusTable = pgTable("livestream_status", {
  id: serial("id").primaryKey(),
  isLive: boolean("is_live").notNull().default(false),
  viewerCount: integer("viewer_count").notNull().default(0),
  title: text("title").notNull().default("Loudthotz Virtual Open Readings"),
  description: text("description").notNull().default("Monthly poetry open readings"),
  season: text("season").notNull().default("Season 14"),
  episode: integer("episode").notNull().default(1),
  streamUrl: text("stream_url"),
  embedUrl: text("embed_url"),
  scheduledAt: timestamp("scheduled_at"),
});
