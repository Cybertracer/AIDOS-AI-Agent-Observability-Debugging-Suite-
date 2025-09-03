
import React, { useState } from 'react';
import type { AgentTrace, ExecutionStep } from '../types';
import { ExecutionGraph } from './ExecutionGraph';
import { StepDetails } from './StepDetails';
import { MetricsPanel } from './MetricsPanel';
import { ToolLogs } from './ToolLogs';
import { Card } from './shared/Card';

interface DashboardProps {
  trace: AgentTrace;
}

export const Dashboard: React.FC<DashboardProps> = ({ trace }) => {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(trace.steps[0]?.id || null);

  const selectedStep = trace.steps.find((step) => step.id === selectedStepId);

  return (
    <div className="space-y-6">
      <MetricsPanel trace={trace} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Agent Execution Flow">
            <div className="h-[600px] w-full bg-gray-800 rounded-lg overflow-auto p-4 relative">
              <ExecutionGraph
                steps={trace.steps}
                selectedStepId={selectedStepId}
                onSelectStep={setSelectedStepId}
              />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <StepDetails step={selectedStep} />
          <ToolLogs steps={trace.steps} onSelectStep={setSelectedStepId} />
        </div>
      </div>
    </div>
  );
};
