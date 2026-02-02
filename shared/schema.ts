import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const repls = pgTable("repls", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Untitled Repl"),
  html: text("html").default(""),
  css: text("css").default(""),
  js: text("js").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReplSchema = createInsertSchema(repls).omit({ id: true, createdAt: true });

export type Repl = typeof repls.$inferSelect;
export type InsertRepl = z.infer<typeof insertReplSchema>;
