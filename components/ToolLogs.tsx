
import React from 'react';
import type { ExecutionStep } from '../types';
import { StepType, StepStatus } from '../types';
import { Card } from './shared/Card';
import { Badge } from './shared/Badge';

interface ToolLogsProps {
  steps: ExecutionStep[];
  onSelectStep: (id: string) => void;
}

const ToolIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
);

export const ToolLogs: React.FC<ToolLogsProps> = ({ steps, onSelectStep }) => {
  const toolCalls = React.useMemo(() => {
    return steps.filter(step => step.type === StepType.TOOL_CALL);
  }, [steps]);

  if (toolCalls.length === 0) {
    return (
        <Card title="Tool Calls" icon={<ToolIcon/>}>
            <div className="text-center py-8 text-gray-500">
                <p>No tool calls in this trace.</p>
            </div>
        </Card>
    );
  }

  return (
    <Card title="Tool Calls" icon={<ToolIcon/>}>
        <div className="max-h-64 overflow-y-auto">
            <ul className="divide-y divide-gray-700">
                {toolCalls.map(step => (
                    <li 
                        key={step.id} 
                        className="p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                        onClick={() => onSelectStep(step.id)}
                    >
                        <div className="flex justify-between items-center">
                            <div className="truncate">
                                <p className="text-sm font-medium text-white truncate">{step.details.toolCall?.toolName}</p>
                                <p className="text-xs text-gray-400">{step.durationMs}ms</p>
                            </div>
                            <Badge color={step.status === StepStatus.SUCCESS ? 'green' : 'red'}>
                                {step.status}
                            </Badge>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </Card>
  );
};
