import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.repls.list.path, async (req, res) => {
    const repls = await storage.getRepls();
    res.json(repls);
  });

  app.get(api.repls.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const repl = await storage.getRepl(id);
    if (!repl) {
      return res.status(404).json({ message: "Repl not found" });
    }
    res.json(repl);
  });

  app.post(api.repls.create.path, async (req, res) => {
    try {
      const input = api.repls.create.input.parse(req.body);
      const repl = await storage.createRepl(input);
      res.status(201).json(repl);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json(e.errors);
      }
      throw e;
    }
  });

  app.put(api.repls.update.path, async (req, res) => {
    const id = Number(req.params.id);
    try {
      const input = api.repls.update.input.parse(req.body);
      const repl = await storage.updateRepl(id, input);
      if (!repl) {
        return res.status(404).json({ message: "Repl not found" });
      }
      res.json(repl);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json(e.errors);
      }
      throw e;
    }
  });

  // Seed data
  const repls = await storage.getRepls();
  if (repls.length === 0) {
    await storage.createRepl({
      title: "Hello World",
      html: "<h1>Hello World</h1>\n<p>Start editing to see some magic happen!</p>",
      css: "h1 {\n  color: #5b21b6;\n  font-family: sans-serif;\n}",
      js: "console.log('Hello from the Repl!');",
    });
    await storage.createRepl({
      title: "Button Counter",
      html: "<button id='btn'>Clicked 0 times</button>",
      css: "button {\n  padding: 10px 20px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\nbutton:hover {\n  background: #1d4ed8;\n}",
      js: "let count = 0;\nconst btn = document.getElementById('btn');\nbtn.addEventListener('click', () => {\n  count++;\n  btn.textContent = `Clicked ${count} times`;\n});",
    });
  }

  return httpServer;
}
