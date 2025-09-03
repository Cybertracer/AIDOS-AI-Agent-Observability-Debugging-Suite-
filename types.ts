
export enum StepType {
  START = 'START',
  PLANNING = 'PLANNING',
  LLM_QUERY = 'LLM_QUERY',
  TOOL_CALL = 'TOOL_CALL',
  OBSERVATION = 'OBSERVATION',
  END = 'END',
}

export enum StepStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  IN_PROGRESS = 'IN_PROGRESS',
}

export interface ToolCall {
  toolName: string;
  parameters: Record<string, any>;
  result: any;
  status: StepStatus;
  error?: string;
}

export interface LLMInteraction {
  prompt: string;
  response: string;
  model: string;
  tokenCount: {
    prompt: number;
    response: number;
    total: number;
  };
  uncertaintyScore?: number;
}

export interface AgentState {
  memory: string[];
  working_directory: string;
  variables: Record<string, any>;
}

export interface ExecutionStep {
  id: string;
  parentId?: string;
  type: StepType;
  status: StepStatus;
  timestamp: string;
  durationMs: number;
  details: {
    title: string;
    description?: string;
    toolCall?: ToolCall;
    llmInteraction?: LLMInteraction;
    agentState?: AgentState;
  };
}

export interface AgentTrace {
  traceId: string;
  agentName: string;
  startTime: string;
  endTime: string;
  totalDurationMs: number;
  finalStatus: StepStatus;
  steps: ExecutionStep[];
}
