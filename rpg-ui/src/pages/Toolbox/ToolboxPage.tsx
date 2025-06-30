import { Link } from "react-router-dom";

interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
}

const tools: Tool[] = [
  {
    id: "kanban",
    name: "Kanban Board",
    description: "Organize and track your adventure tasks and progress",
    path: "/toolbox/kanban",
    icon: "📋",
  },
  {
    id: "phonetics",
    name: "Phonetics Tables",
    description: "Create consistent names and words for your RPG worlds",
    path: "/toolbox/phonetics",
    icon: "🔤",
  },
];

export default function ToolboxPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Toolbox</h1>
          <p className="text-muted-foreground">
            Essential tools to help you manage and create your RPG adventures
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="block bg-card border rounded-lg p-6 hover:bg-accent hover:border-accent-foreground/20 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{tool.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-accent-foreground">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
