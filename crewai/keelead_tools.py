"""
KeeLead CrewAI / AutoGen / Python Agent Tools

Drop-in tools for Python AI agent frameworks.
Works with: CrewAI, AutoGen, LangChain Python, Swarm, Agency Swarm

Usage:
    from keelead_tools import keelead_tools
    crew = Crew(agents=[...], tools=keelead_tools, ...)

Or with AutoGen:
    agent.register_for_llm(name="keelead_search", description="Search leads")
"""

import requests
from typing import Optional, Type
from pydantic import BaseModel, Field

try:
    from crewai_tools import BaseTool
except ImportError:
    # Fallback for non-CrewAI usage
    class BaseTool:
        name: str = ""
        description: str = ""
        args_schema: Type[BaseModel] = None

        def _run(self, **kwargs):
            raise NotImplementedError

        def run(self, **kwargs):
            return self._run(**kwargs)


API_URL = "http://localhost:3000/api"


def _api(path: str, method: str = "GET", body=None):
    url = f"{API_URL}{path}"
    if method == "POST":
        return requests.post(url, json=body).json()
    return requests.get(url).json()


# ─── INPUT SCHEMAS ────────────────────────────────────────────────────────────

class SearchInput(BaseModel):
    query: str = Field(description="Natural language search query for leads")
    count: int = Field(default=25, description="Maximum results to return")


class VerifyInput(BaseModel):
    email: str = Field(description="Email address(es) to verify, comma-separated")


class ResearchInput(BaseModel):
    company: str = Field(description="Company name or domain to research")


class ContactInput(BaseModel):
    query: str = Field(description="Who to find: name, title, company, location")


class EnrichInput(BaseModel):
    email: Optional[str] = Field(default=None, description="Email to enrich")
    name: Optional[str] = Field(default=None, description="Person's name")
    company: Optional[str] = Field(default=None, description="Company name")
    domain: Optional[str] = Field(default=None, description="Company domain")


class SignalsInput(BaseModel):
    company: str = Field(description="Company name")
    type: Optional[str] = Field(default=None, description="Signal type: job_change, hiring, funding, news, social, product")


class ScoreInput(BaseModel):
    title: Optional[str] = Field(default=None, description="Job title")
    company: Optional[str] = Field(default=None, description="Company name")
    industry: Optional[str] = Field(default=None, description="Industry")
    location: Optional[str] = Field(default=None, description="Location")


class ExportInput(BaseModel):
    format: str = Field(description="Export format: csv, json, xlsx, vcard, pdf")
    status: Optional[str] = Field(default=None, description="Filter by status")


# ─── TOOLS ────────────────────────────────────────────────────────────────────

class KeeLeadSearchTool(BaseTool):
    name: str = "keelead_search"
    description: str = (
        "Search for business leads using natural language. "
        "Returns structured lead data with names, emails, companies, titles, and confidence scores. "
        "Example: 'Find 50 SaaS founders in San Francisco'"
    )
    args_schema: Type[BaseModel] = SearchInput

    def _run(self, query: str, count: int = 25) -> str:
        result = _api("/leads", "POST", {"query": query, "count": count})
        leads = result.get("leads", [])
        if not leads:
            return "No leads found for this query."
        lines = [f"Found {len(leads)} leads:\n"]
        for l in leads[:10]:
            lines.append(
                f"- {l.get('firstName', '')} {l.get('lastName', '')} | "
                f"{l.get('company', '-')} | {l.get('title', '-')} | "
                f"{l.get('email', '-')} | Score: {int(l.get('confidence', 0)*100)}%"
            )
        return "\n".join(lines)


class KeeLeadVerifyTool(BaseTool):
    name: str = "keelead_verify_email"
    description: str = (
        "Verify email addresses with 10-layer verification. "
        "Returns score (0-100), status (valid/invalid/catch-all/disposable), and detailed breakdown."
    )
    args_schema: Type[BaseModel] = VerifyInput

    def _run(self, email: str) -> str:
        emails = [e.strip() for e in email.split(",")]
        result = _api("/verify", "POST", {"emails": emails})
        results = result.get("results", [])
        lines = []
        for r in results:
            lines.append(
                f"Email: {r.get('email')} | Status: {r.get('status').upper()} | "
                f"Score: {r.get('score')}/100"
            )
            for layer in r.get("layers", []):
                icon = "✅" if layer.get("passed") else "❌"
                lines.append(f"  {icon} {layer.get('name')}: {layer.get('details')}")
        return "\n".join(lines)


class KeeLeadResearchTool(BaseTool):
    name: str = "keelead_research_company"
    description: str = (
        "Deep research on a company: overview, tech stack, key people, "
        "funding history, competitors, news, social media presence."
    )
    args_schema: Type[BaseModel] = ResearchInput

    def _run(self, company: str) -> str:
        result = _api("/research", "POST", {"query": company})
        lines = [
            f"# {result.get('name', company)} — Company Research\n",
            f"**Industry:** {result.get('industry', 'N/A')}",
            f"**Size:** {result.get('size', 'N/A')} employees",
            f"**Founded:** {result.get('founded', 'N/A')}",
            f"**HQ:** {result.get('headquarters', 'N/A')}",
            f"**Revenue:** {result.get('revenue', 'N/A')}\n",
            f"## Tech Stack\n{', '.join(result.get('techStack', []))}\n",
            "## Key People",
        ]
        for p in result.get("keyPeople", []):
            lines.append(f"- {p.get('name')} — {p.get('title')}")
        lines.append("\n## Funding")
        for f in result.get("funding", []):
            lines.append(f"- {f.get('round')}: {f.get('amount')} ({f.get('date')})")
        lines.append("\n## Competitors")
        lines.append(", ".join(result.get("competitors", [])))
        return "\n".join(lines)


class KeeLeadContactTool(BaseTool):
    name: str = "keelead_find_contact"
    description: str = (
        "Find contact information for a specific person. "
        "Example: 'CTO of Stripe' or 'Sarah Chen at CloudSync'"
    )
    args_schema: Type[BaseModel] = ContactInput

    def _run(self, query: str) -> str:
        result = _api("/leads", "POST", {"query": query, "count": 10})
        leads = result.get("leads", [])
        if not leads:
            return "No contacts found."
        lines = [f"Found {len(leads)} contacts:\n"]
        for l in leads:
            lines.append(
                f"- {l.get('firstName', '')} {l.get('lastName', '')}\n"
                f"  Title: {l.get('title', '-')}\n"
                f"  Company: {l.get('company', '-')}\n"
                f"  Email: {l.get('email', '-')}\n"
                f"  Phone: {l.get('phone', '-')}\n"
                f"  LinkedIn: {l.get('linkedin', '-')}\n"
                f"  Confidence: {int(l.get('confidence', 0)*100)}%"
            )
        return "\n".join(lines)


class KeeLeadEnrichTool(BaseTool):
    name: str = "keelead_enrich_lead"
    description: str = (
        "Enrich a lead with additional data from multiple sources: "
        "email, phone, social profiles, firmographic, technographic data."
    )
    args_schema: Type[BaseModel] = EnrichInput

    def _run(self, email: Optional[str] = None, name: Optional[str] = None,
             company: Optional[str] = None, domain: Optional[str] = None) -> str:
        result = _api("/enrich", "POST", {
            "email": email, "name": name, "company": company, "domain": domain
        })
        return str(result)


class KeeLeadSignalsTool(BaseTool):
    name: str = "keelead_get_signals"
    description: str = (
        "Get intent signals for a company: job changes, hiring, funding, "
        "news, social mentions. Helps identify buying intent."
    )
    args_schema: Type[BaseModel] = SignalsInput

    def _run(self, company: str, type: Optional[str] = None) -> str:
        result = _api("/signals", "POST", {"company": company, "type": type})
        signals = result.get("signals", [])
        if not signals:
            return f"No signals found for {company}."
        lines = [f"Intent signals for {company}:\n"]
        for s in signals:
            lines.append(
                f"- [{s.get('type', '').upper()}] {s.get('title', '')}\n"
                f"  {s.get('description', '')}\n"
                f"  Score: {s.get('score', 0)} | Source: {s.get('source', '')}"
            )
        return "\n".join(lines)


class KeeLeadScoreTool(BaseTool):
    name: str = "keelead_score_lead"
    description: str = "AI lead scoring (0-100) based on ICP fit and intent signals."
    args_schema: Type[BaseModel] = ScoreInput

    def _run(self, title: Optional[str] = None, company: Optional[str] = None,
             industry: Optional[str] = None, location: Optional[str] = None) -> str:
        result = _api("/score", "POST", {
            "lead": {"title": title, "company": company, "industry": industry, "location": location}
        })
        score = result.get("score", 0)
        return f"Lead Score: {score}/100\nBreakdown: {result.get('breakdown', {})}"


class KeeLeadExportTool(BaseTool):
    name: str = "keelead_export_leads"
    description: str = "Export leads to CSV, JSON, Excel, vCard, or PDF format."
    args_schema: Type[BaseModel] = ExportInput

    def _run(self, format: str, status: Optional[str] = None) -> str:
        result = _api("/export", "POST", {"format": format, "filters": {"status": status}})
        return f"Exported {result.get('count', 0)} leads to {format.upper()}\nFile: {result.get('filename', 'N/A')}"


# ─── TOOL COLLECTION ──────────────────────────────────────────────────────────

keelead_tools = [
    KeeLeadSearchTool(),
    KeeLeadVerifyTool(),
    KeeLeadResearchTool(),
    KeeLeadContactTool(),
    KeeLeadEnrichTool(),
    KeeLeadSignalsTool(),
    KeeLeadScoreTool(),
    KeeLeadExportTool(),
]

# AutoGen function definitions (for OpenAI-compatible function calling)
AUTOFN_DEFINITIONS = [
    {
        "name": "keelead_search",
        "description": "Search for business leads using natural language.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"},
                "count": {"type": "integer", "description": "Max results", "default": 25},
            },
            "required": ["query"],
        },
    },
    {
        "name": "keelead_verify_email",
        "description": "Verify email addresses. Returns score 0-100.",
        "parameters": {
            "type": "object",
            "properties": {
                "email": {"type": "string", "description": "Email to verify"},
            },
            "required": ["email"],
        },
    },
    {
        "name": "keelead_research_company",
        "description": "Deep company research: tech stack, people, funding, competitors.",
        "parameters": {
            "type": "object",
            "properties": {
                "company": {"type": "string", "description": "Company name or domain"},
            },
            "required": ["company"],
        },
    },
    {
        "name": "keelead_find_contact",
        "description": "Find contact info for a person by name, company, title.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Who to find"},
            },
            "required": ["query"],
        },
    },
    {
        "name": "keelead_enrich_lead",
        "description": "Enrich a lead with additional data from multiple sources.",
        "parameters": {
            "type": "object",
            "properties": {
                "email": {"type": "string"},
                "company": {"type": "string"},
                "domain": {"type": "string"},
            },
        },
    },
    {
        "name": "keelead_get_signals",
        "description": "Get intent signals: job changes, hiring, funding, news.",
        "parameters": {
            "type": "object",
            "properties": {
                "company": {"type": "string", "description": "Company name"},
            },
            "required": ["company"],
        },
    },
    {
        "name": "keelead_score_lead",
        "description": "AI lead scoring (0-100) based on ICP fit.",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "company": {"type": "string"},
                "industry": {"type": "string"},
            },
        },
    },
    {
        "name": "keelead_export_leads",
        "description": "Export leads to CSV, JSON, Excel, vCard, PDF.",
        "parameters": {
            "type": "object",
            "properties": {
                "format": {"type": "string", "enum": ["csv", "json", "xlsx", "vcard", "pdf"]},
            },
            "required": ["format"],
        },
    },
]
