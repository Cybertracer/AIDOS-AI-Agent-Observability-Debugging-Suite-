import React, { useMemo, useRef, useEffect, useState } from 'react';
import { line, curveBumpY } from 'd3-shape';
import type { ExecutionStep } from '../types';
import { StepType, StepStatus } from '../types';

interface ExecutionGraphProps {
  steps: ExecutionStep[];
  selectedStepId: string | null;
  onSelectStep: (id: string) => void;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Fix: Defined an interface for graph edges to ensure proper type inference.
interface Edge {
  source: NodePosition;
  target: NodePosition;
  status: StepStatus;
}

const TYPE_ICONS: Record<StepType, string> = {
  [StepType.START]: '▶️',
  [StepType.PLANNING]: '📝',
  [StepType.LLM_QUERY]: '🤖',
  [StepType.TOOL_CALL]: '🛠️',
  [StepType.OBSERVATION]: '👁️',
  [StepType.END]: '⏹️',
};

const STATUS_COLORS: Record<StepStatus, string> = {
  [StepStatus.SUCCESS]: 'border-green-500 bg-green-500/10 hover:bg-green-500/20',
  [StepStatus.FAILURE]: 'border-red-500 bg-red-500/10 hover:bg-red-500/20',
  [StepStatus.IN_PROGRESS]: 'border-blue-500 bg-blue-500/10 hover:bg-blue-500/20 animate-pulse-fast',
};

const STATUS_LINE_COLORS: Record<StepStatus, string> = {
    [StepStatus.SUCCESS]: '#22C55E', // green-500
    [StepStatus.FAILURE]: '#EF4444', // red-500
    [StepStatus.IN_PROGRESS]: '#3B82F6', // blue-500
};

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const X_GAP = 80;
const Y_GAP = 50;


export const ExecutionGraph: React.FC<ExecutionGraphProps> = ({ steps, selectedStepId, onSelectStep }) => {
  const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const [positions, setPositions] = useState<Map<string, NodePosition>>(new Map());

  const { nodes, edges, graphWidth, graphHeight } = useMemo(() => {
    const nodeMap = new Map(steps.map(step => [step.id, step]));
    const childrenMap = new Map<string, string[]>();
    
    steps.forEach(step => {
        if (step.parentId) {
            if (!childrenMap.has(step.parentId)) {
                childrenMap.set(step.parentId, []);
            }
            childrenMap.get(step.parentId)!.push(step.id);
        }
    });

    const positionsMap = new Map<string, NodePosition>();
    let maxWidth = 0;
    let maxHeight = 0;

    const traverse = (nodeId: string, x: number, y: number) => {
      if (positionsMap.has(nodeId)) return; // Avoid cycles and redundant processing

      positionsMap.set(nodeId, { id: nodeId, x, y, width: NODE_WIDTH, height: NODE_HEIGHT });
      maxWidth = Math.max(maxWidth, x + NODE_WIDTH);
      maxHeight = Math.max(maxHeight, y + NODE_HEIGHT);

      const children = childrenMap.get(nodeId) || [];
      children.forEach((childId, index) => {
        // Simple vertical layout logic
        const newY = y + NODE_HEIGHT + Y_GAP;
        const newX = x; // For a simple list view. Could be more complex.
        traverse(childId, newX, newY);
      });
    };
    
    const root = steps.find(s => !s.parentId);
    if (root) {
      traverse(root.id, X_GAP, Y_GAP);
    }
    
    setPositions(positionsMap);

    const graphEdges: Edge[] = steps
      .filter(step => step.parentId && positionsMap.has(step.id) && positionsMap.has(step.parentId))
      .map(step => ({
        source: positionsMap.get(step.parentId!)!,
        target: positionsMap.get(step.id)!,
        status: nodeMap.get(step.id)?.status || StepStatus.SUCCESS,
      }));

    return { nodes: steps, edges: graphEdges, graphWidth: maxWidth + X_GAP, graphHeight: maxHeight + Y_GAP };
  }, [steps]);


  const lineGenerator = line<{x: number, y: number}>()
    .x(d => d.x)
    .y(d => d.y)
    .curve(curveBumpY);

  return (
    <div className="relative" style={{ width: graphWidth, height: graphHeight }}>
      <svg className="absolute top-0 left-0 w-full h-full" style={{ width: graphWidth, height: graphHeight }}>
        <defs>
            {Object.values(STATUS_LINE_COLORS).map(color => (
                <marker key={color} id={`arrow-${color.replace('#', '')}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                </marker>
            ))}
        </defs>
        {edges.map(({ source, target, status }, index) => {
          const pathData = lineGenerator([
            { x: source.x + source.width / 2, y: source.y + source.height },
            { x: target.x + target.width / 2, y: target.y },
          ]);
          if (!pathData) return null;

          return (
            <path
              key={`${source.id}-${target.id}`}
              d={pathData}
              stroke={STATUS_LINE_COLORS[status]}
              strokeWidth="2"
              fill="none"
              markerEnd={`url(#arrow-${STATUS_LINE_COLORS[status].replace('#', '')})`}
            />
          );
        })}
      </svg>
      {nodes.map(step => {
        const pos = positions.get(step.id);
        if (!pos) return null;

        const isSelected = selectedStepId === step.id;

        return (
          <div
            key={step.id}
            // Fix: The ref callback must not return a value. `Map.set` returns the map,
            // so we wrap the call in a block to ensure an implicit `undefined` return,
            // which satisfies the `(instance: T | null) => void` type for the ref.
            ref={el => { nodeRefs.current.set(step.id, el); }}
            className={`absolute cursor-pointer p-2 rounded-lg border-2 transition-all duration-200 shadow-lg flex items-center space-x-3 ${STATUS_COLORS[step.status]} ${isSelected ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-cyan-400' : ''}`}
            style={{
              left: pos.x,
              top: pos.y,
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
            }}
            onClick={() => onSelectStep(step.id)}
          >
            <span className="text-xl">{TYPE_ICONS[step.type]}</span>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{step.details.title}</p>
              <p className="text-xs text-gray-400">{step.durationMs}ms</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
