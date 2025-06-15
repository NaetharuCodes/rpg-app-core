interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({
  content,
  className = "",
}: MarkdownPreviewProps) {
  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, index) => {
      // Headers - now supporting # as well
      if (line.startsWith("# ")) {
        return (
          <h1
            key={index}
            className="font-bold text-2xl text-foreground mt-6 mb-3"
          >
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="font-semibold text-xl text-foreground mt-5 mb-3"
          >
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="font-semibold text-lg text-foreground mt-4 mb-2"
          >
            {line.slice(4)}
          </h3>
        );
      }

      // Lists
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 mb-1 list-disc">
            {renderInlineMarkdown(line.slice(2))}
          </li>
        );
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^\d+\.\s(.+)/);
        return (
          <li key={index} className="ml-4 mb-1 list-decimal">
            {renderInlineMarkdown(match?.[1] || "")}
          </li>
        );
      }

      // Blockquotes - treating > as code blocks as requested
      if (line.startsWith("> ")) {
        return (
          <div
            key={index}
            className="border-l-4 border-accent pl-4 my-3 bg-accent/5 py-3 font-mono text-sm rounded-r-md"
          >
            {renderInlineMarkdown(line.slice(2))}
          </div>
        );
      }

      // Empty lines
      if (line.trim() === "") {
        return <br key={index} />;
      }

      // Regular paragraphs
      return (
        <p key={index} className="mb-2">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Helper function to handle inline markdown (bold, italic, code)
  const renderInlineMarkdown = (text: string) => {
    // Handle inline code first (backticks)
    let processed = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>'
    );

    // Handle bold text
    processed = processed.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold">$1</strong>'
    );

    // Handle italic text
    processed = processed.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    return <span dangerouslySetInnerHTML={{ __html: processed }} />;
  };

  return (
    <div className={`prose max-w-none text-muted-foreground ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
}
