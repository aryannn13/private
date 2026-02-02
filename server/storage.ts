import { repls, type Repl, type InsertRepl } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getRepls(): Promise<Repl[]>;
  getRepl(id: number): Promise<Repl | undefined>;
  createRepl(repl: InsertRepl): Promise<Repl>;
  updateRepl(id: number, repl: Partial<InsertRepl>): Promise<Repl>;
}

export class DatabaseStorage implements IStorage {
  async getRepls(): Promise<Repl[]> {
    return await db.select().from(repls).orderBy(repls.createdAt);
  }

  async getRepl(id: number): Promise<Repl | undefined> {
    const [repl] = await db.select().from(repls).where(eq(repls.id, id));
    return repl;
  }

  async createRepl(insertRepl: InsertRepl): Promise<Repl> {
    const [repl] = await db.insert(repls).values(insertRepl).returning();
    return repl;
  }

  async updateRepl(id: number, updateRepl: Partial<InsertRepl>): Promise<Repl> {
    const [repl] = await db.update(repls).set(updateRepl).where(eq(repls.id, id)).returning();
    return repl;
  }
}

export const storage = new DatabaseStorage();
