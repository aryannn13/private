import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertRepl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// GET /api/repls
export function useRepls() {
  return useQuery({
    queryKey: [api.repls.list.path],
    queryFn: async () => {
      const res = await fetch(api.repls.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch repls");
      return api.repls.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/repls/:id
export function useRepl(id: number | null) {
  return useQuery({
    queryKey: [api.repls.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID required");
      const url = buildUrl(api.repls.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch repl");
      return api.repls.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/repls
export function useCreateRepl() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertRepl) => {
      const res = await fetch(api.repls.create.path, {
        method: api.repls.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create repl");
      return api.repls.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.repls.list.path] });
      toast({
        title: "Repl created",
        description: "Your new playground is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// PUT /api/repls/:id
export function useUpdateRepl() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertRepl>) => {
      const url = buildUrl(api.repls.update.path, { id });
      const res = await fetch(url, {
        method: api.repls.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update repl");
      return api.repls.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.repls.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.repls.get.path, data.id] });
      toast({
        title: "Saved successfully",
        description: "Your changes have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
