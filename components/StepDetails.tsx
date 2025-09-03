
import React from 'react';
import type { ExecutionStep, AgentState, LLMInteraction, ToolCall } from '../types';
import { Card } from './shared/Card';
import { Badge } from './shared/Badge';
import { StepStatus } from '../types';

interface StepDetailsProps {
  step: ExecutionStep | undefined;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-3 border-b border-gray-700 last:border-b-0">
    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h4>
    <div className="text-sm text-gray-200">{children}</div>
  </div>
);

const LLMDetails: React.FC<{ llm: LLMInteraction }> = ({ llm }) => (
    <>
        <DetailSection title="Model">
            <Badge color="blue">{llm.model}</Badge>
            {llm.uncertaintyScore && (
                 <span className="ml-2 text-xs text-gray-400">Uncertainty: {(llm.uncertaintyScore * 100).toFixed(1)}%</span>
            )}
        </DetailSection>
        <DetailSection title="Tokens">
            <div className="flex space-x-4">
                <span>Prompt: <span className="font-mono text-cyan-400">{llm.tokenCount.prompt}</span></span>
                <span>Response: <span className="font-mono text-cyan-400">{llm.tokenCount.response}</span></span>
                <span>Total: <span className="font-mono text-cyan-400">{llm.tokenCount.total}</span></span>
            </div>
        </DetailSection>
        <DetailSection title="Prompt">
            <pre className="bg-gray-800 p-3 rounded-md text-gray-300 text-xs whitespace-pre-wrap font-mono">
                {llm.prompt}
            </pre>
        </DetailSection>
        <DetailSection title="Response">
             <pre className="bg-gray-800 p-3 rounded-md text-gray-300 text-xs whitespace-pre-wrap font-mono">
                {llm.response}
            </pre>
        </DetailSection>
    </>
);

const ToolCallDetails: React.FC<{ tool: ToolCall }> = ({ tool }) => (
     <>
        <DetailSection title="Tool Name">
            <Badge color="purple">{tool.toolName}</Badge>
        </DetailSection>
         <DetailSection title="Status">
            <Badge color={tool.status === StepStatus.SUCCESS ? 'green' : 'red'}>{tool.status}</Badge>
        </DetailSection>
        <DetailSection title="Parameters">
            <pre className="bg-gray-800 p-3 rounded-md text-gray-300 text-xs whitespace-pre-wrap font-mono">
                {JSON.stringify(tool.parameters, null, 2)}
            </pre>
        </DetailSection>
        {tool.result && (
             <DetailSection title="Result">
                <pre className="bg-gray-800 p-3 rounded-md text-gray-300 text-xs whitespace-pre-wrap font-mono">
                    {JSON.stringify(tool.result, null, 2)}
                </pre>
            </DetailSection>
        )}
        {tool.error && (
             <DetailSection title="Error">
                <pre className="bg-red-900/50 p-3 rounded-md text-red-300 text-xs whitespace-pre-wrap font-mono">
                    {tool.error}
                </pre>
            </DetailSection>
        )}
    </>
);

const AgentStateDetails: React.FC<{ state: AgentState }> = ({ state }) => (
    <DetailSection title="Agent State">
        <div className="space-y-2">
            <div>
                <h5 className="font-semibold text-xs text-gray-400">Variables</h5>
                <pre className="bg-gray-800 p-2 mt-1 rounded-md text-gray-300 text-xs whitespace-pre-wrap font-mono">
                    {JSON.stringify(state.variables, null, 2)}
                </pre>
            </div>
            <div>
                 <h5 className="font-semibold text-xs text-gray-400">Memory</h5>
                 <pre className="bg-gray-800 p-2 mt-1 rounded-md text-gray-300 text-xs whitespace-pre-wrap font-mono">
                     {state.memory.length > 0 ? state.memory.join('\n') : '(empty)'}
                </pre>
            </div>
        </div>
    </DetailSection>
);

export const StepDetails: React.FC<StepDetailsProps> = ({ step }) => {
  if (!step) {
    return (
      <Card title="Step Details">
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>Select a step from the graph to see its details.</p>
        </div>
      </Card>
    );
  }

  const { details } = step;

  return (
    <Card title="Step Details" subtitle={`${step.details.title}`}>
        <div className="max-h-[800px] overflow-y-auto pr-2">
            <DetailSection title="Metadata">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <span className="text-gray-400">Type:</span> <Badge color="blue">{step.type}</Badge>
                    <span className="text-gray-400">Status:</span> <Badge color={step.status === StepStatus.SUCCESS ? 'green' : 'red'}>{step.status}</Badge>
                    <span className="text-gray-400">Duration:</span> <span>{step.durationMs}ms</span>
                    <span className="text-gray-400">Timestamp:</span> <span>{new Date(step.timestamp).toLocaleTimeString()}</span>
                </div>
            </DetailSection>
            
            {details.description && <DetailSection title="Description">{details.description}</DetailSection>}
            {details.llmInteraction && <LLMDetails llm={details.llmInteraction} />}
            {details.toolCall && <ToolCallDetails tool={details.toolCall} />}
            {details.agentState && <AgentStateDetails state={details.agentState} />}
        </div>
    </Card>
  );
};
