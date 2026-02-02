import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useRepls, useCreateRepl } from "@/hooks/use-repls";
import { Plus, Code, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const { data: repls, isLoading } = useRepls();
  const { mutate: createRepl, isPending } = useCreateRepl();
  const [, setLocation] = useLocation();

  const handleCreate = () => {
    createRepl(
      { title: "Untitled Repl", html: "", css: "", js: "" },
      { onSuccess: (data) => setLocation(`/repl/${data.id}`) }
    );
  };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Manage your coding experiments.
            </p>
          </div>
          <Button 
            onClick={handleCreate} 
            disabled={isPending}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-blue-500/10"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Repl
          </Button>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-muted/20 border border-border/50 animate-pulse" />
            ))}
          </div>
        ) : repls?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl bg-muted/5">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Code className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No repls yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Start building something amazing with our powerful online code editor.
            </p>
            <Button onClick={handleCreate} disabled={isPending}>
              Create your first Repl
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repls?.map((repl) => (
              <Link 
                key={repl.id} 
                href={`/repl/${repl.id}`}
                className="group block"
              >
                <div className="h-full bg-card hover:bg-muted/30 border border-border/50 hover:border-blue-500/50 rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-blue-500 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Code className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-blue-400 transition-colors truncate">
                      {repl.title || "Untitled Repl"}
                    </h3>
                  </div>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/60 font-mono">
                      <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">HTML</span>
                      <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">CSS</span>
                      <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">JS</span>
                    </div>
                    <div className="text-xs text-muted-foreground pt-3 border-t border-border/30">
                      Last edited {repl.createdAt ? formatDistanceToNow(new Date(repl.createdAt), { addSuffix: true }) : "recently"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
