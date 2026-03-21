from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorClient
from models import (
    HeroSlideCreate, HeroSlideUpdate,
    CapabilityCreate, CapabilityUpdate,
    ProjectCreate, ProjectUpdate,
    ClientCreate, ClientUpdate,
    TestimonialCreate, TestimonialUpdate,
    CompanyInfoUpdate, AdminLogin, Token, AdminUserCreate
)
from auth import (
    get_current_user, get_password_hash, verify_password, create_access_token
)
from typing import List
import os
from bson import ObjectId
from datetime import datetime, timedelta
import shutil
from pathlib import Path

router = APIRouter(prefix="/api/admin", tags=["admin"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


# Authentication Routes
@router.post("/login", response_model=Token)
async def login(credentials: AdminLogin):
    user = await db.admin_users.find_one({"username": credentials.username})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Update last login
    await db.admin_users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
async def get_current_admin_user(username: str = Depends(get_current_user)):
    user = await db.admin_users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    del user["password"]
    return user


# Hero Slides Routes
@router.get("/hero-slides", response_model=List[dict])
async def get_all_hero_slides(username: str = Depends(get_current_user)):
    slides = await db.hero_slides.find().sort("order", 1).to_list(100)
    for slide in slides:
        slide["_id"] = str(slide["_id"])
    return slides


@router.post("/hero-slides", response_model=dict)
async def create_hero_slide(slide: HeroSlideCreate, username: str = Depends(get_current_user)):
    slide_dict = slide.dict()
    slide_dict["created_at"] = datetime.utcnow()
    slide_dict["updated_at"] = datetime.utcnow()
    result = await db.hero_slides.insert_one(slide_dict)
    slide_dict["_id"] = str(result.inserted_id)
    return slide_dict


@router.put("/hero-slides/{slide_id}", response_model=dict)
async def update_hero_slide(slide_id: str, slide: HeroSlideUpdate, username: str = Depends(get_current_user)):
    update_data = {k: v for k, v in slide.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.hero_slides.update_one(
        {"_id": ObjectId(slide_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Hero slide not found")
    
    updated_slide = await db.hero_slides.find_one({"_id": ObjectId(slide_id)})
    updated_slide["_id"] = str(updated_slide["_id"])
    return updated_slide


@router.delete("/hero-slides/{slide_id}")
async def delete_hero_slide(slide_id: str, username: str = Depends(get_current_user)):
    result = await db.hero_slides.delete_one({"_id": ObjectId(slide_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hero slide not found")
    return {"message": "Hero slide deleted successfully"}


# Capabilities Routes
@router.get("/capabilities", response_model=List[dict])
async def get_all_capabilities(username: str = Depends(get_current_user)):
    capabilities = await db.capabilities.find().sort("order", 1).to_list(100)
    for capability in capabilities:
        capability["_id"] = str(capability["_id"])
    return capabilities


@router.post("/capabilities", response_model=dict)
async def create_capability(capability: CapabilityCreate, username: str = Depends(get_current_user)):
    capability_dict = capability.dict()
    capability_dict["created_at"] = datetime.utcnow()
    capability_dict["updated_at"] = datetime.utcnow()
    result = await db.capabilities.insert_one(capability_dict)
    capability_dict["_id"] = str(result.inserted_id)
    return capability_dict


@router.put("/capabilities/{capability_id}", response_model=dict)
async def update_capability(capability_id: str, capability: CapabilityUpdate, username: str = Depends(get_current_user)):
    update_data = {k: v for k, v in capability.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.capabilities.update_one(
        {"_id": ObjectId(capability_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Capability not found")
    
    updated_capability = await db.capabilities.find_one({"_id": ObjectId(capability_id)})
    updated_capability["_id"] = str(updated_capability["_id"])
    return updated_capability


@router.delete("/capabilities/{capability_id}")
async def delete_capability(capability_id: str, username: str = Depends(get_current_user)):
    result = await db.capabilities.delete_one({"_id": ObjectId(capability_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Capability not found")
    return {"message": "Capability deleted successfully"}


# Projects Routes
@router.get("/projects", response_model=List[dict])
async def get_all_projects(username: str = Depends(get_current_user)):
    projects = await db.projects.find().sort("created_at", -1).to_list(100)
    for project in projects:
        project["_id"] = str(project["_id"])
    return projects


@router.post("/projects", response_model=dict)
async def create_project(project: ProjectCreate, username: str = Depends(get_current_user)):
    project_dict = project.dict()
    project_dict["created_at"] = datetime.utcnow()
    project_dict["updated_at"] = datetime.utcnow()
    result = await db.projects.insert_one(project_dict)
    project_dict["_id"] = str(result.inserted_id)
    return project_dict


@router.put("/projects/{project_id}", response_model=dict)
async def update_project(project_id: str, project: ProjectUpdate, username: str = Depends(get_current_user)):
    update_data = {k: v for k, v in project.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    updated_project = await db.projects.find_one({"_id": ObjectId(project_id)})
    updated_project["_id"] = str(updated_project["_id"])
    return updated_project


@router.delete("/projects/{project_id}")
async def delete_project(project_id: str, username: str = Depends(get_current_user)):
    result = await db.projects.delete_one({"_id": ObjectId(project_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}


# Clients Routes
@router.get("/clients", response_model=List[dict])
async def get_all_clients(username: str = Depends(get_current_user)):
    clients = await db.clients.find().sort("order", 1).to_list(100)
    for client in clients:
        client["_id"] = str(client["_id"])
    return clients


@router.post("/clients", response_model=dict)
async def create_client(client: ClientCreate, username: str = Depends(get_current_user)):
    client_dict = client.dict()
    client_dict["created_at"] = datetime.utcnow()
    client_dict["updated_at"] = datetime.utcnow()
    result = await db.clients.insert_one(client_dict)
    client_dict["_id"] = str(result.inserted_id)
    return client_dict


@router.put("/clients/{client_id}", response_model=dict)
async def update_client(client_id: str, client: ClientUpdate, username: str = Depends(get_current_user)):
    update_data = {k: v for k, v in client.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.clients.update_one(
        {"_id": ObjectId(client_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    
    updated_client = await db.clients.find_one({"_id": ObjectId(client_id)})
    updated_client["_id"] = str(updated_client["_id"])
    return updated_client


@router.delete("/clients/{client_id}")
async def delete_client(client_id: str, username: str = Depends(get_current_user)):
    result = await db.clients.delete_one({"_id": ObjectId(client_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"message": "Client deleted successfully"}


# Testimonials Routes
@router.get("/testimonials", response_model=List[dict])
async def get_all_testimonials(username: str = Depends(get_current_user)):
    testimonials = await db.testimonials.find().sort("order", 1).to_list(100)
    for testimonial in testimonials:
        testimonial["_id"] = str(testimonial["_id"])
    return testimonials


@router.post("/testimonials", response_model=dict)
async def create_testimonial(testimonial: TestimonialCreate, username: str = Depends(get_current_user)):
    testimonial_dict = testimonial.dict()
    testimonial_dict["created_at"] = datetime.utcnow()
    testimonial_dict["updated_at"] = datetime.utcnow()
    result = await db.testimonials.insert_one(testimonial_dict)
    testimonial_dict["_id"] = str(result.inserted_id)
    return testimonial_dict


@router.put("/testimonials/{testimonial_id}", response_model=dict)
async def update_testimonial(testimonial_id: str, testimonial: TestimonialUpdate, username: str = Depends(get_current_user)):
    update_data = {k: v for k, v in testimonial.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.testimonials.update_one(
        {"_id": ObjectId(testimonial_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    updated_testimonial = await db.testimonials.find_one({"_id": ObjectId(testimonial_id)})
    updated_testimonial["_id"] = str(updated_testimonial["_id"])
    return updated_testimonial


@router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, username: str = Depends(get_current_user)):
    result = await db.testimonials.delete_one({"_id": ObjectId(testimonial_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}


# Contact Submissions Routes
@router.get("/contacts", response_model=List[dict])
async def get_all_contacts(username: str = Depends(get_current_user)):
    contacts = await db.contact_submissions.find().sort("created_at", -1).to_list(100)
    for contact in contacts:
        contact["_id"] = str(contact["_id"])
    return contacts


@router.put("/contacts/{contact_id}", response_model=dict)
async def update_contact_status(contact_id: str, status: str, username: str = Depends(get_current_user)):
    result = await db.contact_submissions.update_one(
        {"_id": ObjectId(contact_id)},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Contact submission not found")
    
    updated_contact = await db.contact_submissions.find_one({"_id": ObjectId(contact_id)})
    updated_contact["_id"] = str(updated_contact["_id"])
    return updated_contact


@router.delete("/contacts/{contact_id}")
async def delete_contact(contact_id: str, username: str = Depends(get_current_user)):
    result = await db.contact_submissions.delete_one({"_id": ObjectId(contact_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact submission not found")
    return {"message": "Contact submission deleted successfully"}


# Company Info Routes
@router.get("/company-info", response_model=dict)
async def get_company_info_admin(username: str = Depends(get_current_user)):
    info = await db.company_info.find_one()
    if not info:
        raise HTTPException(status_code=404, detail="Company info not found")
    info["_id"] = str(info["_id"])
    return info


@router.put("/company-info", response_model=dict)
async def update_company_info(info: CompanyInfoUpdate, username: str = Depends(get_current_user)):
    update_data = {k: v for k, v in info.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.company_info.update_one({}, {"$set": update_data})
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Company info not found")
    
    updated_info = await db.company_info.find_one()
    updated_info["_id"] = str(updated_info["_id"])
    return updated_info


# File Upload Route
@router.post("/upload")
async def upload_file(file: UploadFile = File(...), username: str = Depends(get_current_user)):
    # Generate unique filename
    import uuid
    file_ext = file.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    backend_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
    file_url = f"{backend_url}/api/uploads/{unique_filename}"
    
    return {"url": file_url, "filename": unique_filename}


# Dashboard Stats
@router.get("/dashboard-stats")
async def get_dashboard_stats(username: str = Depends(get_current_user)):
    hero_slides_count = await db.hero_slides.count_documents({})
    capabilities_count = await db.capabilities.count_documents({})
    projects_count = await db.projects.count_documents({})
    clients_count = await db.clients.count_documents({})
    testimonials_count = await db.testimonials.count_documents({})
    contacts_count = await db.contact_submissions.count_documents({"status": "new"})
    
    return {
        "hero_slides": hero_slides_count,
        "capabilities": capabilities_count,
        "projects": projects_count,
        "clients": clients_count,
        "testimonials": testimonials_count,
        "new_contacts": contacts_count
    }
