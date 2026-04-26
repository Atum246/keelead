"""
KeeLead CrewAI Tools

Drop-in tools for CrewAI agents. Use KeeLead's capabilities
as CrewAI tools in any multi-agent workflow.

Usage:
    from keelead_crewai import keelead_tools
    crew = Crew(agents=[...], tools=keelead_tools, ...)
"""

# Python tools that call KeeLead's REST API
# These work with CrewAI, AutoGen, and any Python agent framework

KEELEAD_TOOLS_PYTHON = '''
import requests
from typing import Optional, Type
from pydantic import BaseModel, Field
from crewai_tools import BaseTool

API_URL = "http://localhost:3000/api"

class KeeLeadSearchInput(BaseModel):
    query: str = Field(description="Natural language search query for leads")
    count: int = Field(default=25, description="Maximum number of results")

class KeeLeadSearchTool(BaseTool):
    name: str = "keelead_search"
    description: str = "Search for business leads using natural language. Returns structured lead data with names, emails, companies, titles, and confidence scores."
    args_schema: Type[BaseModel] = KeeLeadSearchInput

    def _run(self, query: str, count: int = 25) -> str:
        resp = requests.post(f"{API_URL}/leads", json={"query": query, "count": count})
        return resp.json()

class KeeLeadVerifyInput(BaseModel):
    email: str = Field(description="Email address to verify")

class KeeLeadVerifyTool(BaseTool):
    name: str = "keelead_verify_email"
    description: str = "Verify email addresses with 10-layer verification. Returns score 0-100 and status."
    args_schema: Type[BaseModel] = KeeLeadVerifyInput

    def _run(self, email: str) -> str:
        resp = requests.post(f"{API_URL}/verify", json={"emails": [email]})
        return resp.json()

class KeeLeadResearchInput(BaseModel):
    company: str = Field(description="Company name or domain to research")

class KeeLeadResearchTool(BaseTool):
    name: str = "keelead_research_company"
    description: str = "Deep research on a company: overview, tech stack, key people, funding, competitors, news."
    args_schema: Type[BaseModel] = KeeLeadResearchInput

    def _run(self, company: str) -> str:
        resp = requests.post(f"{API_URL}/research", json={"query": company})
        return resp.json()

class KeeLeadContactInput(BaseModel):
    query: str = Field(description="Who to find: name, title, company, location")

class KeeLeadContactTool(BaseTool):
    name: str = "keelead_find_contact"
    description: str = "Find contact information for a specific person by name, company, title, or location."
    args_schema: Type[BaseModel] = KeeLeadContactInput

    def _run(self, query: str) -> str:
        resp = requests.post(f"{API_URL}/leads", json={"query": query, "count": 10})
        return resp.json()

class KeeLeadEnrichInput(BaseModel):
    email: Optional[str] = Field(default=None, description="Email to enrich")
    company: Optional[str] = Field(default=None, description="Company name")
    domain: Optional[str] = Field(default=None, description="Company domain")

class KeeLeadEnrichTool(BaseTool):
    name: str = "keelead_enrich_lead"
    description: str = "Enrich a lead with additional data: email, phone, social profiles, firmographic, technographic."
    args_schema: Type[BaseModel] = KeeLeadEnrichInput

    def _run(self, email: Optional[str] = None, company: Optional[str] = None, domain: Optional[str] = None) -> str:
        resp = requests.post(f"{API_URL}/enrich", json={"email": email, "company": company, "domain": domain})
        return resp.json()

class KeeLeadSignalsInput(BaseModel):
    company: str = Field(description="Company name to get signals for")

class KeeLeadSignalsTool(BaseTool):
    name: str = "keelead_get_signals"
    description: str = "Get intent signals: job changes, hiring, funding, news, social mentions for a company."
    args_schema: Type[BaseModel] = KeeLeadSignalsInput

    def _run(self, company: str) -> str:
        resp = requests.post(f"{API_URL}/signals", json={"company": company})
        return resp.json()

class KeeLeadScoreInput(BaseModel):
    title: Optional[str] = Field(default=None, description="Job title")
    company: Optional[str] = Field(default=None, description="Company name")
    industry: Optional[str] = Field(default=None, description="Industry")

class KeeLeadScoreTool(BaseTool):
    name: str = "keelead_score_lead"
    description: str = "AI lead scoring (0-100) based on ICP fit and intent signals."
    args_schema: Type[BaseModel] = KeeLeadScoreInput

    def _run(self, title: Optional[str] = None, company: Optional[str] = None, industry: Optional[str] = None) -> str:
        resp = requests.post(f"{API_URL}/score", json={"lead": {"title": title, "company": company, "industry": industry}})
        return resp.json()

class KeeLeadExportInput(BaseModel):
    format: str = Field(description="Export format: csv, json, xlsx, vcard, pdf")

class KeeLeadExportTool(BaseTool):
    name: str = "keelead_export_leads"
    description: str = "Export leads to CSV, JSON, Excel, vCard, or PDF format."
    args_schema: Type[BaseModel] = KeeLeadExportInput

    def _run(self, format: str) -> str:
        resp = requests.post(f"{API_URL}/export", json={"format": format})
        return resp.json()

# All tools
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
'''

# Write Python file
with open("/root/.openclaw/workspace/keelead/crewai/keelead_tools.py", "w") as f:
    f.write(KEELEAD_TOOLS_PYTHON)

print("✅ Created crewai/keelead_tools.py")
