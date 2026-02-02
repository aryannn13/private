import { z } from 'zod';
import { insertReplSchema, repls } from './schema';

export const api = {
  repls: {
    list: {
      method: 'GET' as const,
      path: '/api/repls',
      responses: {
        200: z.array(z.custom<typeof repls.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/repls/:id',
      responses: {
        200: z.custom<typeof repls.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/repls',
      input: insertReplSchema,
      responses: {
        201: z.custom<typeof repls.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/repls/:id',
      input: insertReplSchema.partial(),
      responses: {
        200: z.custom<typeof repls.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
