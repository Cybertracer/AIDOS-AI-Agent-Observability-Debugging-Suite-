
import React from 'react';
import type { AgentTrace } from '../types';
import { StepStatus, StepType } from '../types';
import { Card } from './shared/Card';

interface MetricsPanelProps {
  trace: AgentTrace;
}

const MetricCard: React.FC<{ title: string; value: string | number; colorClass?: string }> = ({ title, value, colorClass = 'text-cyan-400' }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h4 className="text-sm text-gray-400">{title}</h4>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </div>
);

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ trace }) => {
  const { totalLLMTokens, toolCalls, successfulToolCalls } = React.useMemo(() => {
    let totalLLMTokens = 0;
    let toolCalls = 0;
    let successfulToolCalls = 0;

    trace.steps.forEach(step => {
      if (step.type === StepType.LLM_QUERY && step.details.llmInteraction) {
        totalLLMTokens += step.details.llmInteraction.tokenCount.total;
      }
      if (step.type === StepType.TOOL_CALL) {
        toolCalls++;
        if (step.status === StepStatus.SUCCESS) {
          successfulToolCalls++;
        }
      }
    });

    return { totalLLMTokens, toolCalls, successfulToolCalls };
  }, [trace]);
  
  const toolSuccessRate = toolCalls > 0 ? ((successfulToolCalls / toolCalls) * 100).toFixed(0) + '%' : 'N/A';

  return (
    <Card title="Trace Overview" subtitle={trace.agentName}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard 
          title="Final Status" 
          value={trace.finalStatus}
          colorClass={trace.finalStatus === StepStatus.SUCCESS ? 'text-green-500' : 'text-red-500'}
        />
        <MetricCard title="Total Duration" value={`${(trace.totalDurationMs / 1000).toFixed(2)}s`} />
        <MetricCard title="Total Steps" value={trace.steps.length} />
        <MetricCard title="LLM Tokens Used" value={totalLLMTokens} />
        <MetricCard 
            title="Tool Success Rate" 
            value={toolSuccessRate} 
            colorClass={toolSuccessRate === '100%' || toolSuccessRate === 'N/A' ? 'text-green-500' : 'text-yellow-500'}
        />
      </div>
    </Card>
  );
};
