import { useEffect, useState, useCallback } from "react";
import { useParams } from "wouter";
import { CodeEditor } from "@/components/CodeEditor";
import { Preview } from "@/components/Preview";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRepl, useUpdateRepl } from "@/hooks/use-repls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Play, Save, FileCode, FileType, FileJson } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useToast } from "@/hooks/use-toast";
import debounce from "lodash/debounce";

export default function ReplEditor() {
  const { id } = useParams<{ id: string }>();
  const replId = parseInt(id);
  
  const { data: repl, isLoading } = useRepl(replId);
  const { mutate: updateRepl, isPending: isSaving } = useUpdateRepl();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [triggerRun, setTriggerRun] = useState(0);

  // Initialize state when data loads
  useEffect(() => {
    if (repl) {
      setTitle(repl.title);
      setHtml(repl.html || "");
      setCss(repl.css || "");
      setJs(repl.js || "");
    }
  }, [repl]);

  // Debounced auto-save (optional - currently manual save is implemented)
  // But let's stick to manual save button as requested to be explicit
  
  const handleSave = () => {
    updateRepl({
      id: replId,
      title,
      html,
      css,
      js
    });
  };

  const handleRun = () => {
    setTriggerRun(prev => prev + 1);
    toast({
      description: "Preview updated",
      duration: 1000,
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="animate-pulse">Loading environment...</p>
        </div>
      </div>
    );
  }

  if (!repl) return <div>Not found</div>;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <div className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-6 shrink-0 gap-4">
          <div className="flex-1 max-w-md">
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-bold text-lg h-9 bg-transparent border-transparent hover:border-border focus:border-primary px-2 -ml-2 transition-all"
              placeholder="Untitled Repl"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRun}
              className="text-green-500 hover:text-green-600 hover:bg-green-500/10 border-green-500/20"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              Run
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[100px]"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Editor Layout */}
        <div className="flex-1 overflow-hidden p-2">
          <ResizablePanelGroup direction="horizontal" className="rounded-lg border border-border/40">
            {/* Code Editors Pane */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={33} minSize={10}>
                  <div className="h-full p-1">
                    <CodeEditor 
                      value={html} 
                      onChange={setHtml} 
                      language="html" 
                      label="HTML" 
                      icon={<FileType className="w-3.5 h-3.5 text-orange-500" />}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle className="bg-border/40 hover:bg-blue-500/50 transition-colors" />
                <ResizablePanel defaultSize={33} minSize={10}>
                  <div className="h-full p-1">
                    <CodeEditor 
                      value={css} 
                      onChange={setCss} 
                      language="css" 
                      label="CSS"
                      icon={<FileCode className="w-3.5 h-3.5 text-blue-500" />}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle className="bg-border/40 hover:bg-blue-500/50 transition-colors" />
                <ResizablePanel defaultSize={34} minSize={10}>
                  <div className="h-full p-1">
                    <CodeEditor 
                      value={js} 
                      onChange={setJs} 
                      language="js" 
                      label="JS"
                      icon={<FileJson className="w-3.5 h-3.5 text-yellow-500" />}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            
            <ResizableHandle className="w-2 bg-border/20 hover:bg-blue-500/50 transition-colors relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-muted-foreground/20 rounded-full" />
            </ResizableHandle>

            {/* Preview Pane */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-2 bg-muted/10">
                <Preview 
                  key={triggerRun} // Force re-render on Run click
                  html={html} 
                  css={css} 
                  js={js} 
                  autoRefresh={false} // Only update when Run is clicked or on mount
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </DashboardLayout>
  );
}
