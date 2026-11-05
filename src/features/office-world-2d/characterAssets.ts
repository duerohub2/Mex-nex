export type OfficeCharacterAsset = {
  id: string;
  name: string;
  role: string;
  src: string;
  x: number;
  y: number;
};

export const MEX_NEX_AGENT_ASSETS: readonly OfficeCharacterAsset[] = [
  { id: "agent-01-analyst", name: "ANALYST", role: "Research", src: "/office-assets/characters/agents/base/agent-01-analyst.jpg", x: 300, y: 300 },
  { id: "agent-02-office-admin", name: "ADMIN", role: "Office Administration", src: "/office-assets/characters/agents/base/agent-02-office-admin.jpg", x: 410, y: 420 },
  { id: "agent-03-designer", name: "DESIGNER", role: "Design", src: "/office-assets/characters/agents/base/agent-03-designer.jpg", x: 500, y: 300 },
  { id: "agent-04-it-support", name: "IT SUPPORT", role: "IT Support", src: "/office-assets/characters/agents/base/agent-04-it-support.jpg", x: 600, y: 420 },
  { id: "agent-05-general-staff", name: "STAFF", role: "General Office", src: "/office-assets/characters/agents/base/agent-05-general-staff.jpg", x: 700, y: 300 },
  { id: "agent-06-technical-specialist", name: "TECH", role: "Technical Specialist", src: "/office-assets/characters/agents/base/agent-06-technical-specialist.jpg", x: 900, y: 300 },
  { id: "agent-07-engineering", name: "ENGINEER", role: "Engineering", src: "/office-assets/characters/agents/base/agent-07-engineering.jpg", x: 1010, y: 420 },
  { id: "agent-08-operations", name: "OPERATIONS", role: "Operations", src: "/office-assets/characters/agents/base/agent-08-operations.jpg", x: 1100, y: 300 },
  { id: "agent-09-engineering-assistant", name: "DEV OPS", role: "Engineering Support", src: "/office-assets/characters/agents/base/agent-09-engineering-assistant.jpg", x: 1200, y: 420 },
  { id: "agent-10-finance", name: "FINANCE", role: "Finance", src: "/office-assets/characters/agents/base/agent-10-finance.jpg", x: 1300, y: 300 },
  { id: "agent-11-compliance", name: "COMPLIANCE", role: "Compliance", src: "/office-assets/characters/agents/base/agent-11-compliance.jpg", x: 290, y: 610 },
  { id: "agent-12-office-worker", name: "OFFICE", role: "Office Operations", src: "/office-assets/characters/agents/base/agent-12-office-worker.jpg", x: 400, y: 730 },
  { id: "agent-13-compliance-specialist", name: "QA", role: "Quality Assurance", src: "/office-assets/characters/agents/base/agent-13-compliance-specialist.jpg", x: 500, y: 610 },
  { id: "agent-14-employee", name: "AGENT 14", role: "Team Member", src: "/office-assets/characters/agents/base/agent-14-employee.jpg", x: 600, y: 730 },
  { id: "agent-15-marketing", name: "MARKETING", role: "Marketing", src: "/office-assets/characters/agents/base/agent-15-marketing.jpg", x: 700, y: 610 },
  { id: "agent-16-manager", name: "MANAGER", role: "Management", src: "/office-assets/characters/agents/base/agent-16-manager.jpg", x: 900, y: 610 },
  { id: "agent-17-receptionist", name: "RECEPTION", role: "Reception", src: "/office-assets/characters/agents/base/agent-17-receptionist.jpg", x: 1010, y: 730 },
  { id: "agent-18-documentation", name: "DOCS", role: "Documentation", src: "/office-assets/characters/agents/base/agent-18-documentation.jpg", x: 1100, y: 610 },
  { id: "agent-19-creative", name: "CREATIVE", role: "Creative", src: "/office-assets/characters/agents/base/agent-19-creative.jpg", x: 1200, y: 730 },
  { id: "agent-20-product-design", name: "PRODUCT", role: "Product Design", src: "/office-assets/characters/agents/base/agent-20-product-design.jpg", x: 1300, y: 610 },
] as const;

export const MEX_NEX_OWNER_AVATAR: OfficeCharacterAsset = {
  id: "owner-avatar",
  name: "DUERO",
  role: "Pemilik MEX-NEX",
  src: "/office-assets/characters/personal/avatar-owner.jpg",
  x: 800,
  y: 500,
};
