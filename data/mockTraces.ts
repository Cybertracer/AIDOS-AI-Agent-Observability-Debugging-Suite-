
import type { AgentTrace } from '../types';
import { StepType, StepStatus } from '../types';

export const mockAgentTrace: AgentTrace = {
  traceId: 'trace-001',
  agentName: 'Research Assistant Agent',
  startTime: '2023-10-27T10:00:00Z',
  endTime: '2023-10-27T10:00:15Z',
  totalDurationMs: 15000,
  finalStatus: StepStatus.SUCCESS,
  steps: [
    {
      id: 'step-1',
      type: StepType.START,
      status: StepStatus.SUCCESS,
      timestamp: '2023-10-27T10:00:00Z',
      durationMs: 0,
      details: { title: 'Agent Invoked' },
    },
    {
      id: 'step-2',
      parentId: 'step-1',
      type: StepType.PLANNING,
      status: StepStatus.SUCCESS,
      timestamp: '2023-10-27T10:00:01Z',
      durationMs: 500,
      details: {
        title: 'Initial Plan',
        description: 'I need to find the capital of France, then find its current weather, and finally provide a summary.',
        agentState: {
          memory: [],
          working_directory: '/app',
          variables: { 'user_query': 'What is the weather in the capital of France?' },
        },
      },
    },
    {
      id: 'step-3',
      parentId: 'step-2',
      type: StepType.TOOL_CALL,
      status: StepStatus.SUCCESS,
      timestamp: '2023-10-27T10:00:03Z',
      durationMs: 1500,
      details: {
        title: 'Tool: search_engine',
        toolCall: {
          toolName: 'search_engine',
          parameters: { query: 'capital of France' },
          result: { capital: 'Paris' },
          status: StepStatus.SUCCESS,
        },
      },
    },
    {
      id: 'step-4',
      parentId: 'step-3',
      type: StepType.OBSERVATION,
      status: StepStatus.SUCCESS,
      timestamp: '2023-10-27T10:00:05Z',
      durationMs: 100,
      details: {
        title: 'Observation',
        description: 'Tool `search_engine` returned: The capital of France is Paris.',
        agentState: {
          memory: ['The capital of France is Paris.'],
          working_directory: '/app',
          variables: { 'user_query': 'What is the weather in the capital of France?', 'capital': 'Paris' },
        },
      },
    },
    {
      id: 'step-5',
      parentId: 'step-4',
      type: StepType.LLM_QUERY,
      status: StepStatus.SUCCESS,
      timestamp: '2023-10-27T10:00:08Z',
      durationMs: 2500,
      details: {
        title: 'LLM Query: Formulate Next Step',
        llmInteraction: {
          prompt: "Based on the memory, the next step is to find the weather in 'Paris'. Formulate the tool call.",
          response: 'I should now call the `weather_api` tool with the city "Paris".',
          model: 'gemini-2.5-flash',
          tokenCount: { prompt: 50, response: 25, total: 75 },
          uncertaintyScore: 0.05,
        },
      },
    },
    {
      id: 'step-6',
      parentId: 'step-5',
      type: StepType.TOOL_CALL,
      status: StepStatus.SUCCESS,
      timestamp: '2023-10-27T10:00:10Z',
      durationMs: 2000,
      details: {
        title: 'Tool: weather_api',
        toolCall: {
          toolName: 'weather_api',
          parameters: { city: 'Paris' },
          result: { temperature: '18°C', condition: 'Sunny' },
          status: StepStatus.SUCCESS,
        },
      },
    },
    {
      id: 'step-7',
      parentId: 'step-6',
      type: StepType.LLM_QUERY,
      status: StepStatus.SUCCESS,
      timestamp: '2023-10-27T10:00:14Z',
      durationMs: 3000,
      details: {
        title: 'LLM Query: Final Answer',
        llmInteraction: {
          prompt: 'Synthesize the final answer using all collected information.',
          response: 'The current weather in Paris, the capital of France, is 18°C and Sunny.',
          model: 'gemini-2.5-flash',
          tokenCount: { prompt: 70, response: 40, total: 110 },
          uncertaintyScore: 0.02,
        },
      },
    },
    {
      id: 'step-8',
      parentId: 'step-7',
      type: StepType.END,
      status: StepStatus.SUCCESS,
      timestamp: '2023-10-27T10:00:15Z',
      durationMs: 0,
      details: { title: 'Agent Finished' },
    },
  ],
};

export const mockFailedAgentTrace: AgentTrace = {
  ...mockAgentTrace,
  traceId: 'trace-002',
  agentName: 'Failing Research Agent',
  endTime: '2023-10-27T10:00:11Z',
  totalDurationMs: 11000,
  finalStatus: StepStatus.FAILURE,
  steps: [
    ...mockAgentTrace.steps.slice(0, 5),
    {
      id: 'step-6-fail',
      parentId: 'step-5',
      type: StepType.TOOL_CALL,
      status: StepStatus.FAILURE,
      timestamp: '2023-10-27T10:00:10Z',
      durationMs: 1200,
      details: {
        title: 'Tool: weather_api',
        toolCall: {
          toolName: 'weather_api',
          parameters: { city: 'Paris' },
          result: null,
          status: StepStatus.FAILURE,
          error: 'APIError: Rate limit exceeded. Please try again later.',
        },
      },
    },
    {
      id: 'step-7-fail',
      parentId: 'step-6-fail',
      type: StepType.END,
      status: StepStatus.FAILURE,
      timestamp: '2023-10-27T10:00:11Z',
      durationMs: 0,
      details: { 
        title: 'Agent Finished with Error',
        description: 'Agent execution halted due to a critical tool failure.'
      },
    },
  ]
};
