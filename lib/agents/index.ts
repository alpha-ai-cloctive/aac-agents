import { jakePrompt } from "./jake";
import { mayaPrompt } from "./maya";
import { raviPrompt } from "./ravi";
import { chloePrompt } from "./chloe";
import { marcusPrompt } from "./marcus";
import { alexPrompt } from "./alex";

export interface Agent {
  name: string;
  color: string;
  specialty: string;
  prompt: string;
}

export const agents: Agent[] = [
  {
    name: "Jake Morrison",
    color: "#3b82f6",
    specialty: "SaaS Builder",
    prompt: jakePrompt,
  },
  {
    name: "Maya Chen",
    color: "#ec4899",
    specialty: "Digital Products",
    prompt: mayaPrompt,
  },
  {
    name: "Ravi Sharma",
    color: "#10b981",
    specialty: "App Builder",
    prompt: raviPrompt,
  },
  {
    name: "Chloe Davies",
    color: "#f59e0b",
    specialty: "Web Dev Freelancer",
    prompt: chloePrompt,
  },
  {
    name: "Marcus Webb",
    color: "#6366f1",
    specialty: "Info Products",
    prompt: marcusPrompt,
  },
  {
    name: "Alex",
    color: "#c8a84b",
    specialty: "Community Admin",
    prompt: alexPrompt,
  },
];
