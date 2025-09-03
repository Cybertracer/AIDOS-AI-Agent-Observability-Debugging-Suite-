
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import type { AgentTrace } from './types';
import { mockAgentTrace, mockFailedAgentTrace } from './data/mockTraces';

const App: React.FC = () => {
  const [activeTrace, setActiveTrace] = useState<AgentTrace>(mockAgentTrace);

  const traces = useMemo(() => [
    { name: 'Trace #1 - Successful Research Agent', data: mockAgentTrace },
    { name: 'Trace #2 - Failed Tool Call', data: mockFailedAgentTrace },
  ], []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <label htmlFor="trace-selector" className="block text-sm font-medium text-gray-400 mb-2">
            Select Agent Trace
          </label>
          <select
            id="trace-selector"
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full md:w-1/3 p-2.5"
            onChange={(e) => setActiveTrace(traces[parseInt(e.target.value)].data)}
          >
            {traces.map((trace, index) => (
              <option key={trace.name} value={index}>
                {trace.name}
              </option>
            ))}
          </select>
        </div>
        <Dashboard key={activeTrace.traceId} trace={activeTrace} />
      </main>
    </div>
  );
};

export default App;
