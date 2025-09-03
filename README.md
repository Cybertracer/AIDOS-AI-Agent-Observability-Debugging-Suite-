
# AIDOS: AI Agent Observability & Debugging Suite

![AIDOS Dashboard Screenshot]([https://storage.googleapis.com/aistos-91db4.appspot.com/aidos_screenshot.png]([https://drive.google.com/file/d/16Mc3snmsxbBrP4kqwB91jWCimoXW3kNi/view?usp=sharing])

AIDOS is a comprehensive open-source suite for real-time tracing, interactive visualization, and concept-based debugging, specifically tailored for complex AI agents. As agents built with frameworks like LangChain, LlamaIndex, and AutoGPT become more sophisticated, debugging their multi-step reasoning, tool interactions, and unexpected behaviors becomes extremely difficult. AIDOS provides the granular, agent-specific insights needed to build transparent and reliable autonomous systems.

## Core Problem Addressed

Current MLOps and observability tools often lack the specific focus required for AI agents. They might show you logs or basic metrics, but they don't help you understand the *why* behind an agent's decision-making process. AIDOS bridges this gap by providing a "thought-loop" visualizer that maps an agent's entire execution trajectory.

## Key Features

*   **Visual Execution Graph**: An interactive graph that visualizes the agent's execution flow and decision points, clearly showing parent-child relationships between steps.
*   **Step-by-Step Replay**: Select any node in the graph to inspect the complete state and details of that specific step.
*   **LLM Prompt/Response Analytics**: Dive deep into LLM interactions, including the exact prompt, response, model used, token counts, and uncertainty scores.
*   **Detailed Tool Call Logs**: Monitor all tool calls, view their parameters, see their success/failure status, and inspect the data they returned or the errors they produced.
*   **Agent State Inspection**: See a snapshot of the agent's internal state (e.g., memory, variables) at various points in its execution.
*   **Customizable Dashboard**: Get a high-level overview of key agent performance metrics, such as total duration, final status, and tool success rate.

---

## How to Use AIDOS with Your Agent

AIDOS is designed to be a frontend visualization layer for your agent's execution data. To use it, you need to instrument your agent to produce a trace log in the JSON format that AIDOS understands.

### 1. The Data Format

The core of the integration is the `AgentTrace` object. Your agent's execution should be serialized into a single JSON object matching this structure. The TypeScript definitions can be found in `src/types.ts`.

#### Main Structure: `AgentTrace`

```json
{
  "traceId": "unique-trace-id-123",
  "agentName": "Your Research Agent",
  "startTime": "2023-10-28T10:00:00Z",
  "endTime": "2023-10-28T10:00:15Z",
  "totalDurationMs": 15000,
  "finalStatus": "SUCCESS",
  "steps": [
    // ... array of ExecutionStep objects
  ]
}
```

#### Step Structure: `ExecutionStep`

Each step in your agent's process is an object in the `steps` array. **Crucially, steps are linked via `id` and `parentId` to build the graph.** The first step should have no `parentId`.

```json
{
  "id": "step-2",
  "parentId": "step-1",
  "type": "PLANNING",
  "status": "SUCCESS",
  "timestamp": "2023-10-28T10:00:01Z",
  "durationMs": 500,
  "details": {
    "title": "Initial Plan",
    "description": "I need to find the capital of France and then get the weather.",
    // The following fields are optional and depend on the step 'type'
    "toolCall": { "... details ..." },
    "llmInteraction": { "... details ..." },
    "agentState": { "... details ..." }
  }
}
```

*   **`type`**: Can be one of `START`, `PLANNING`, `LLM_QUERY`, `TOOL_CALL`, `OBSERVATION`, `END`.
*   **`status`**: Can be `SUCCESS`, `FAILURE`, or `IN_PROGRESS`.

#### Populating `details`

-   For an `LLM_QUERY` step, add an `llmInteraction` object.
-   For a `TOOL_CALL` step, add a `toolCall` object.
-   For a `PLANNING` or `OBSERVATION` step, you can add an `agentState` object to show the agent's memory and variables at that point.

You can see complete, detailed examples in `src/data/mockTraces.ts`.

### 2. Generating and Visualizing Your Trace

1.  **Instrument Your Agent**: Modify your agent's code to log each significant action (planning, calling an LLM, using a tool, observing the result) by creating an `ExecutionStep` object for it.
2.  **Collect the Steps**: As the agent runs, collect these step objects in a list.
3.  **Assemble the Final Trace**: Once the agent finishes, wrap the list of steps in the main `AgentTrace` object, adding the top-level metadata.
4.  **Save as JSON**: Save the complete `AgentTrace` object as a JSON file.
5.  **Visualize in AIDOS**:
    *   Open the file `src/data/mockTraces.ts` in the AIDOS project.
    *   Replace the content of `mockAgentTrace` or `mockFailedAgentTrace` with your own generated JSON data.
    *   Run the AIDOS development server (`npm install && npm run dev`).
    *   Your trace will now be loaded and visualized in the dashboard.

---

## Technical Stack

*   **Framework**: React
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Visualization**: D3.js (for SVG path generation)

## Future Roadmap

AIDOS is currently a powerful frontend for visualizing pre-generated traces. Future development could include:

-   [ ] **Backend Service**: A dedicated backend (e.g., FastAPI, Express) to receive and store agent traces via an API.
-   [ ] **Real-time Tracing**: Use WebSockets to visualize agent execution live as it happens.
-   [ ] **Semantic Diffing**: A component to compare the prompts and responses of two different LLM steps.
-   [ ] **Anomaly Detection**: AI-driven analysis to automatically flag potential reasoning failures or unexpected deviations in agent behavior.
-   [ ] **LangChain/LlamaIndex Integration**: Official packages/callbacks to make instrumenting agents in these popular frameworks trivial.
