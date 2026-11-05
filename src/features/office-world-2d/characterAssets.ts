export type OfficeCharacterAsset = {
  id: string;
  name: string;
  role: string;
  src: string;
  x: number;
  y: number;
};

export const MEX_NEX_AGENT_ASSETS: readonly OfficeCharacterAsset[] = [
  { id: "agent-01-analyst", name: "ANALYST", role: "Research", src: "/office-assets/characters/v2-transparent/agents/agent-01-analyst.png", x: 300, y: 300 },
  { id: "agent-02-office-admin", name: "ADMIN", role: "Office Administration", src: "/office-assets/characters/v2-transparent/agents/agent-02-office-admin.png", x: 410, y: 420 },
  { id: "agent-03-designer", name: "DESIGNER", role: "Design", src: "/office-assets/characters/v2-transparent/agents/agent-03-designer.png", x: 500, y: 300 },
  { id: "agent-04-it-support", name: "IT SUPPORT", role: "IT Support", src: "/office-assets/characters/v2-transparent/agents/agent-04-it-support.png", x: 600, y: 420 },
  { id: "agent-05-general-staff", name: "STAFF", role: "General Office", src: "/office-assets/characters/v2-transparent/agents/agent-05-general-staff.png", x: 700, y: 300 },
  { id: "agent-06-technical-specialist", name: "TECH", role: "Technical Specialist", src: "/office-assets/characters/v2-transparent/agents/agent-06-technical-specialist.png", x: 900, y: 300 },
  { id: "agent-07-engineering", name: "ENGINEER", role: "Engineering", src: "/office-assets/characters/v2-transparent/agents/agent-07-engineering.png", x: 1010, y: 420 },
  { id: "agent-08-operations", name: "OPERATIONS", role: "Operations", src: "/office-assets/characters/v2-transparent/agents/agent-08-operations.png", x: 1100, y: 300 },
  { id: "agent-09-engineering-assistant", name: "DEV OPS", role: "Engineering Support", src: "/office-assets/characters/v2-transparent/agents/agent-09-engineering-assistant.png", x: 1200, y: 420 },
  { id: "agent-10-finance", name: "FINANCE", role: "Finance", src: "/office-assets/characters/v2-transparent/agents/agent-10-finance.png", x: 1300, y: 300 },
  { id: "agent-11-compliance", name: "COMPLIANCE", role: "Compliance", src: "/office-assets/characters/v2-transparent/agents/agent-11-compliance.png", x: 290, y: 610 },
  { id: "agent-12-office-worker", name: "OFFICE OPS", role: "Office Operations", src: "/office-assets/characters/v2-transparent/agents/agent-12-office-worker.png", x: 400, y: 730 },
  { id: "agent-13-compliance-specialist", name: "QA", role: "Quality Assurance", src: "/office-assets/characters/v2-transparent/agents/agent-13-compliance-specialist.png", x: 500, y: 610 },
  { id: "agent-14-employee", name: "AGENT 14", role: "Team Member", src: "/office-assets/characters/v2-transparent/agents/agent-14-employee.png", x: 600, y: 730 },
  { id: "agent-15-marketing", name: "MARKETING", role: "Marketing", src: "/office-assets/characters/v2-transparent/agents/agent-15-marketing.png", x: 700, y: 610 },
  { id: "agent-16-manager", name: "MANAGER", role: "Management", src: "/office-assets/characters/v2-transparent/agents/agent-16-manager.png", x: 900, y: 610 },
  { id: "agent-17-receptionist", name: "RECEPTION", role: "Reception", src: "/office-assets/characters/v2-transparent/agents/agent-17-receptionist.png", x: 1010, y: 730 },
  { id: "agent-18-documentation", name: "DOCS", role: "Documentation", src: "/office-assets/characters/v2-transparent/agents/agent-18-documentation.png", x: 1100, y: 610 },
  { id: "agent-19-creative", name: "CREATIVE", role: "Creative", src: "/office-assets/characters/v2-transparent/agents/agent-19-creative.png", x: 1200, y: 730 },
  { id: "agent-20-product-design", name: "PRODUCT", role: "Product Design", src: "/office-assets/characters/v2-transparent/agents/agent-20-product-design.png", x: 1300, y: 610 },
] as const;

export const MEX_NEX_OWNER_AVATAR: OfficeCharacterAsset = {
  id: "owner-avatar",
  name: "DUERO",
  role: "Pemilik MEX-NEX",
  src: "/office-assets/characters/v2-transparent/personal/avatar-owner.png",
  x: 800,
  y: 790,
};
