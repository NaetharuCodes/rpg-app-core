import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface NPC {
  id: number;
  name: string;
  age: number;
  gender: string;
  profession: string;
  social_class: string;
  personality: string;
  location?: {
    name: string;
  };
  memberships?: {
    organization: {
      name: string;
    };
    rank: {
      title: string;
    };
  }[];
  from_relationships?: {
    id: number;
    to_npc: NPC;
    relationship_type: string;
    relationship_subtype: string;
    strength: number;
  }[];
  to_relationships?: {
    id: number;
    from_npc: NPC;
    relationship_type: string;
    relationship_subtype: string;
    strength: number;
  }[];
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  name: string;
  profession: string;
  social_class: string;
  relationshipCount: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: GraphNode | number;
  target: GraphNode | number;
  relationship_type: string;
  relationship_subtype: string;
  strength: number;
}

interface NPCRelationshipGraphProps {
  npcs: NPC[];
  width?: number;
  height?: number;
}

export function NPCRelationshipGraph({
  npcs,
  width,
  height,
}: NPCRelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!npcs.length || !svgRef.current || !containerRef.current) return;

    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = Math.max(600, window.innerHeight - 300); // Dynamic height based on viewport

    const actualWidth = width || containerWidth;
    const actualHeight = height || containerHeight;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Transform data
    const { nodes, links } = transformData(npcs);

    console.log("Nodes:", nodes);
    console.log("Links:", links);

    if (nodes.length === 0) {
      // Show message if no relationships
      const svg = d3.select(svgRef.current);
      svg
        .append("text")
        .attr("x", actualWidth / 2)
        .attr("y", actualHeight / 2)
        .attr("text-anchor", "middle")
        .attr("class", "fill-muted-foreground text-lg")
        .text("No relationships found between NPCs");
      return;
    }

    // Create simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .distance((d: GraphLink) => 100 - d.strength * 5) // Closer for stronger relationships
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(actualWidth / 2, actualHeight / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", actualWidth)
      .attr("height", actualHeight);

    // Add zoom behavior
    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    // Create link elements
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: GraphLink) =>
        getRelationshipColor(d.relationship_type)
      )
      .attr("stroke-width", (d: GraphLink) => Math.max(1, d.strength / 2))
      .attr("stroke-opacity", 0.6);

    // Create node elements
    const node = g
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: GraphNode) => Math.max(8, 5 + d.relationshipCount * 2))
      .attr("fill", (d: GraphNode) => getSocialClassColor(d.social_class))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // Add labels
    const labels = g
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d: GraphNode) => d.name)
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("text-anchor", "middle")
      .attr("dy", -15)
      .attr("class", "fill-foreground pointer-events-none");

    // Add drag behavior
    const drag = d3
      .drag<SVGCircleElement, GraphNode>()
      .on(
        "start",
        (
          event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>,
          d: GraphNode
        ) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
      )
      .on(
        "drag",
        (
          event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>,
          d: GraphNode
        ) => {
          d.fx = event.x;
          d.fy = event.y;
        }
      )
      .on(
        "end",
        (
          event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>,
          d: GraphNode
        ) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
      );

    node.call(drag as any);

    // Add hover effects
    node
      .on("mouseover", (event: MouseEvent, d: GraphNode) => {
        d3.select(event.currentTarget as SVGCircleElement)
          .attr("stroke-width", 4)
          .attr("r", Math.max(12, 9 + d.relationshipCount * 2));

        // Highlight connected links
        link.attr("stroke-opacity", (l: GraphLink) => {
          const sourceId =
            typeof l.source === "object" ? l.source.id : l.source;
          const targetId =
            typeof l.target === "object" ? l.target.id : l.target;
          return sourceId === d.id || targetId === d.id ? 1 : 0.1;
        });
      })
      .on("mouseout", (event: MouseEvent, d: GraphNode) => {
        d3.select(event.currentTarget as SVGCircleElement)
          .attr("stroke-width", 2)
          .attr("r", Math.max(8, 5 + d.relationshipCount * 2));

        link.attr("stroke-opacity", 0.6);
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: GraphLink) => {
          const source =
            typeof d.source === "object"
              ? d.source
              : nodes.find((n) => n.id === d.source);
          return source?.x || 0;
        })
        .attr("y1", (d: GraphLink) => {
          const source =
            typeof d.source === "object"
              ? d.source
              : nodes.find((n) => n.id === d.source);
          return source?.y || 0;
        })
        .attr("x2", (d: GraphLink) => {
          const target =
            typeof d.target === "object"
              ? d.target
              : nodes.find((n) => n.id === d.target);
          return target?.x || 0;
        })
        .attr("y2", (d: GraphLink) => {
          const target =
            typeof d.target === "object"
              ? d.target
              : nodes.find((n) => n.id === d.target);
          return target?.y || 0;
        });

      node
        .attr("cx", (d: GraphNode) => d.x || 0)
        .attr("cy", (d: GraphNode) => d.y || 0);

      labels
        .attr("x", (d: GraphNode) => d.x || 0)
        .attr("y", (d: GraphNode) => d.y || 0);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [npcs, width, height]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span>Family</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Professional</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
          <span>Friend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>Rival</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-pink-500"></div>
          <span>Romantic</span>
        </div>
      </div>
      <svg
        ref={svgRef}
        className="border border-border rounded-lg bg-card w-full"
        style={{ minHeight: "600px" }}
      />
      <div className="mt-2 text-xs text-muted-foreground">
        Drag nodes to reposition • Scroll to zoom • Node size indicates
        relationship count
      </div>
    </div>
  );
}

// Helper functions
function transformData(npcs: NPC[]) {
  const nodeMap = new Map<number, GraphNode>();
  const links: GraphLink[] = [];

  // First pass: collect all NPCs that appear in relationships
  const npcIdsInRelationships = new Set<number>();

  npcs.forEach((npc) => {
    npc.from_relationships?.forEach((rel) => {
      npcIdsInRelationships.add(npc.id);
      npcIdsInRelationships.add(rel.to_npc.id);
    });
    npc.to_relationships?.forEach((rel) => {
      npcIdsInRelationships.add(npc.id);
      npcIdsInRelationships.add(rel.from_npc.id);
    });
  });

  // Create nodes only for NPCs that appear in relationships
  npcs.forEach((npc) => {
    if (npcIdsInRelationships.has(npc.id)) {
      const relationshipCount =
        (npc.from_relationships?.length || 0) +
        (npc.to_relationships?.length || 0);
      nodeMap.set(npc.id, {
        id: npc.id,
        name: npc.name,
        profession: npc.profession,
        social_class: npc.social_class,
        relationshipCount,
      });
    }
  });

  const nodes = Array.from(nodeMap.values());

  // Create a mapping from NPC ID to array index
  const idToIndex = new Map<number, number>();
  nodes.forEach((node, index) => {
    idToIndex.set(node.id, index);
  });

  // Create links from relationships using array indices
  npcs.forEach((npc) => {
    // From relationships
    npc.from_relationships?.forEach((rel) => {
      const sourceIndex = idToIndex.get(npc.id);
      const targetIndex = idToIndex.get(rel.to_npc.id);

      // Only create link if both indices exist
      if (sourceIndex !== undefined && targetIndex !== undefined) {
        links.push({
          source: sourceIndex,
          target: targetIndex,
          relationship_type: rel.relationship_type,
          relationship_subtype: rel.relationship_subtype,
          strength: rel.strength,
        });
      }
    });
  });

  console.log("Valid links after filtering:", links.length);

  return {
    nodes,
    links,
  };
}

function getRelationshipColor(type: string): string {
  const colors = {
    family: "#3b82f6",
    professional: "#10b981",
    friend: "#8b5cf6",
    rival: "#ef4444",
    romantic: "#ec4899",
  };
  return colors[type as keyof typeof colors] || "#6b7280";
}

function getSocialClassColor(socialClass: string): string {
  const colors = {
    peasant: "#8b5cf6",
    commoner: "#3b82f6",
    merchant: "#10b981",
    minor_noble: "#f59e0b",
    noble: "#ef4444",
  };
  return colors[socialClass as keyof typeof colors] || "#6b7280";
}
