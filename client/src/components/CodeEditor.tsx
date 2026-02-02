import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css" | "js";
  label: string;
  icon?: React.ReactNode;
}

export function CodeEditor({ value, onChange, language, label, icon }: CodeEditorProps) {
  const getHighlighter = (code: string) => {
    switch (language) {
      case "html": return highlight(code, languages.markup, "markup");
      case "css": return highlight(code, languages.css, "css");
      case "js": return highlight(code, languages.javascript, "javascript");
      default: return code;
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/30 rounded-lg overflow-hidden border border-border/50 shadow-sm transition-all duration-200 hover:border-border group">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/50">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {icon}
          {label}
        </div>
      </div>
      <div className="flex-1 relative overflow-auto editor-wrapper bg-[#0d1117]">
        <Editor
          value={value}
          onValueChange={onChange}
          highlight={getHighlighter}
          padding={16}
          className="font-mono min-h-full text-sm"
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: 14,
            backgroundColor: "transparent",
            minHeight: "100%"
          }}
          textareaClassName="focus:outline-none"
        />
      </div>
    </div>
  );
}
