from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from models import ContactSubmissionCreate
from typing import List, Optional
import os
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/api/public", tags=["public"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


@router.get("/hero-slides", response_model=List[dict])
async def get_hero_slides():
    slides = await db.hero_slides.find({"is_active": True}).sort("order", 1).to_list(100)
    for slide in slides:
        slide["_id"] = str(slide["_id"])
    return slides


@router.get("/capabilities", response_model=List[dict])
async def get_capabilities():
    capabilities = await db.capabilities.find({"is_active": True}).sort("order", 1).to_list(100)
    for capability in capabilities:
        capability["_id"] = str(capability["_id"])
    return capabilities


@router.get("/projects", response_model=List[dict])
async def get_projects(category: Optional[str] = None):
    query = {"is_active": True}
    if category and category != "All":
        query["category"] = category
    projects = await db.projects.find(query).sort("created_at", -1).to_list(100)
    for project in projects:
        project["_id"] = str(project["_id"])
    return projects


@router.get("/projects/{project_id}", response_model=dict)
async def get_project_by_id(project_id: str):
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id), "is_active": True})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project["_id"] = str(project["_id"])

    # Get related projects (same category, exclude current)
    related = await db.projects.find(
        {"category": project["category"], "_id": {"$ne": ObjectId(project_id)}, "is_active": True}
    ).limit(3).to_list(3)
    for r in related:
        r["_id"] = str(r["_id"])
    project["related_projects"] = related
    return project


@router.get("/clients", response_model=List[dict])
async def get_clients():
    clients = await db.clients.find({"is_active": True}).sort("order", 1).to_list(100)
    for client in clients:
        client["_id"] = str(client["_id"])
    return clients


@router.get("/testimonials", response_model=List[dict])
async def get_testimonials():
    testimonials = await db.testimonials.find({"is_active": True}).sort("order", 1).to_list(100)
    for testimonial in testimonials:
        testimonial["_id"] = str(testimonial["_id"])
    return testimonials


@router.get("/company-info", response_model=dict)
async def get_company_info():
    info = await db.company_info.find_one()
    if not info:
        raise HTTPException(status_code=404, detail="Company info not found")
    info["_id"] = str(info["_id"])
    return info


@router.post("/contact", response_model=dict)
async def submit_contact_form(contact: ContactSubmissionCreate):
    contact_dict = contact.model_dump()
    contact_dict["status"] = "new"
    contact_dict["created_at"] = datetime.now(timezone.utc)
    contact_dict["updated_at"] = datetime.now(timezone.utc)
    
    result = await db.contact_submissions.insert_one(contact_dict)
    contact_dict["_id"] = str(result.inserted_id)
    
    return {"message": "Contact form submitted successfully", "id": str(result.inserted_id)}


@router.get("/pages/{page_name}", response_model=dict)
async def get_page_content(page_name: str):
    page = await db.page_contents.find_one({"page_name": page_name, "is_active": True})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    page["_id"] = str(page["_id"])
    return page
