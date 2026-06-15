import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const booksTable = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  amazonUrl: text("amazon_url").notNull(),
  accentColor: text("accent_color").notNull().default("lime"),
  coverTagline: text("cover_tagline"),
});

export const insertBookSchema = createInsertSchema(booksTable).omit({ id: true });
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof booksTable.$inferSelect;
