import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const poemsTable = pgTable("poems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  country: text("country").notNull(),
  content: text("content").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  averageRating: numeric("average_rating", { precision: 3, scale: 2 }).notNull().default("0"),
  ratingCount: integer("rating_count").notNull().default(0),
  ratingSum: integer("rating_sum").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  season: text("season"),
  theme: text("theme"),
});

export const insertPoemSchema = createInsertSchema(poemsTable).omit({ id: true });
export type InsertPoem = z.infer<typeof insertPoemSchema>;
export type Poem = typeof poemsTable.$inferSelect;
