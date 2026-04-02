"use client";

import { useState } from "react";
import { agents } from "@/lib/agents";

const channels = [
  { id: "BBBSaIAdqoA6cZ", name: "Wins & Results" },
  { id: "ZVOPS8rTadcx2O", name: "Introduce Yourself" },
  { id: "aMPTdxQzaVfl6I", name: "Accountability" },
  { id: "tPbD3BgeRhOn4U", name: "Tool Reviews" },
  { id: "DaDBfPnN6cScaO", name: "Trending Today" },
  { id: "PD66pXM3XhQ1nO", name: "Welcome & Rules" },
];

const exampleMessages = [
  {
    id: 1,
    author: "Danny R.",
    content:
      "Just hit £500 MRR on my first SaaS! Took 3 months but we're here 🎉",
    tag: "Win",
    tagColor: "#10b981",
    suggestedAgents: ["Jake Morrison", "Maya Chen", "Alex"],
  },
  {
    id: 2,
    author: "Sophie K.",
    content:
      "Been trying to deploy my Next.js app on Vercel but keep getting build errors with the API routes. Anyone dealt with this?",
    tag: "Tech Q",
    tagColor: "#3b82f6",
    suggestedAgents: ["Ravi Sharma", "Chloe Davies", "Jake Morrison"],
  },
  {
    id: 3,
    author: "Mike T.",
    content:
      "Feeling stuck. Built the product but have no idea how to get my first customers. Everything I try just doesn't land.",
    tag: "Stuck",
    tagColor: "#f59e0b",
    suggestedAgents: ["Marcus Webb", "Maya Chen", "Chloe Davies"],
  },
];

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [generateAgent, setGenerateAgent] = useState(agents[0].name);
  const [generateChannel, setGenerateChannel] = useState(channels[0].id);
  const [generateMessage, setGenerateMessage] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  async function handleGenerate() {
    if (!generateMessage.trim()) return;
    setGenerating(true);
    setGeneratedResponse("");
    setCopyStatus("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: generateAgent,
          message: generateMessage,
          channel: generateChannel,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedResponse(data.response);
    } catch {
      setGeneratedResponse("Error generating response. Check your API key.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopyToClipboard() {
    if (!generatedResponse) return;
    try {
      await navigator.clipboard.writeText(generatedResponse);
      setCopyStatus(`Copied! Paste into Whop as ${generateAgent}`);
      setTimeout(() => setCopyStatus(""), 3000);
    } catch {
      setCopyStatus("Failed to copy to clipboard.");
      setTimeout(() => setCopyStatus(""), 3000);
    }
  }

  async function handleQuickGenerate(message: string, agentName: string) {
    setGenerateAgent(agentName);
    setGenerateMessage(message);
    setGenerating(true);
    setGeneratedResponse("");
    setCopyStatus("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName,
          message,
          channel: "general",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedResponse(data.response);
    } catch {
      setGeneratedResponse("Error generating response. Check your API key.");
    } finally {
      setGenerating(false);
    }
  }

  const agentColor = (name: string) =>
    agents.find((a) => a.name === name)?.color || "#c8a84b";

  return (
    <div className="min-h-screen bg-navy p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              AAC Agent Control Panel
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Alpha AI Collective — Agent Management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-gray-400">System Online</span>
          </div>
        </div>

        {/* Agent Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedAgent("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedAgent === "all"
                ? "bg-gold text-navy"
                : "bg-navy-light text-gray-300 border border-border hover:border-gold/50"
            }`}
          >
            All Agents
          </button>
          {agents.map((agent) => (
            <button
              key={agent.name}
              onClick={() => setSelectedAgent(agent.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedAgent === agent.name
                  ? "text-white"
                  : "bg-navy-light text-gray-300 border border-border hover:border-gray-500"
              }`}
              style={
                selectedAgent === agent.name
                  ? { backgroundColor: agent.color }
                  : {}
              }
            >
              {agent.name}
              <span className="ml-2 text-xs opacity-70">
                {agent.specialty}
              </span>
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Posts Today", value: "12", sub: "+3 from yesterday" },
            { label: "Pending Review", value: "4", sub: "2 flagged" },
            { label: "New Members", value: "7", sub: "This week" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-navy-light border border-border rounded-xl p-5"
            >
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Messages List */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Community Messages
            </h2>
            <div className="space-y-3">
              {exampleMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-navy-light border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                      {msg.author}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: msg.tagColor + "20",
                        color: msg.tagColor,
                      }}
                    >
                      {msg.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{msg.content}</p>
                  <div className="flex gap-2">
                    {msg.suggestedAgents.map((name) => (
                      <button
                        key={name}
                        onClick={() =>
                          handleQuickGenerate(msg.content, name)
                        }
                        className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:text-white"
                        style={{
                          borderColor: agentColor(name) + "60",
                          color: agentColor(name),
                        }}
                      >
                        {name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate & Preview */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Generate Response
            </h2>
            <div className="bg-navy-light border border-border rounded-xl p-4 space-y-4">
              {/* Agent Dropdown */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Agent
                </label>
                <select
                  value={generateAgent}
                  onChange={(e) => setGenerateAgent(e.target.value)}
                  className="w-full bg-navy border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
                >
                  {agents.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name} — {a.specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel Dropdown */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Channel
                </label>
                <select
                  value={generateChannel}
                  onChange={(e) => setGenerateChannel(e.target.value)}
                  className="w-full bg-navy border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
                >
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Message
                </label>
                <textarea
                  value={generateMessage}
                  onChange={(e) => setGenerateMessage(e.target.value)}
                  placeholder="Paste or type the community message to respond to..."
                  rows={3}
                  className="w-full bg-navy border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold resize-none"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating || !generateMessage.trim()}
                className="w-full bg-gold text-navy font-semibold py-2.5 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {generating ? "Generating..." : "Generate Response"}
              </button>
            </div>

            {/* Response Preview */}
            {generatedResponse && (
              <div className="mt-4 bg-navy-light border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: agentColor(generateAgent) }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: agentColor(generateAgent) }}
                  >
                    {generateAgent}
                  </span>
                </div>
                <p className="text-sm text-gray-200 whitespace-pre-wrap mb-4">
                  {generatedResponse}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Switch to {generateAgent}&apos;s Whop tab, paste and send.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyToClipboard}
                    className="bg-gold text-navy font-medium text-sm px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={() => {
                      const edited = prompt("Edit response:", generatedResponse);
                      if (edited !== null) setGeneratedResponse(edited);
                    }}
                    className="bg-navy border border-border text-gray-300 font-medium text-sm px-4 py-2 rounded-lg hover:border-gray-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="bg-navy border border-border text-gray-300 font-medium text-sm px-4 py-2 rounded-lg hover:border-gray-500 transition-colors disabled:opacity-50"
                  >
                    Regenerate
                  </button>
                </div>
                {copyStatus && (
                  <p
                    className={`text-xs mt-2 ${
                      copyStatus.includes("Copied")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {copyStatus}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
