from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId


class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: Any, _handler: Any):
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x)),
        )

    @classmethod
    def validate(cls, value):
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)


# Hero Slides
class HeroSlideCreate(BaseModel):
    title: str
    subtitle: str
    description: str
    image: str
    order: int = 0
    is_active: bool = True


class HeroSlideUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Capabilities
class CapabilityCreate(BaseModel):
    title: str
    image: str
    description: Optional[str] = ""
    order: int = 0
    is_active: bool = True


class CapabilityUpdate(BaseModel):
    title: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Projects
class ProjectCreate(BaseModel):
    title: str
    category: str
    description: str
    client: str
    image: str
    is_featured: bool = False
    is_active: bool = True


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    client: Optional[str] = None
    image: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None


# Clients
class ClientCreate(BaseModel):
    name: str
    logo: str
    order: int = 0
    is_active: bool = True


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    logo: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Testimonials
class TestimonialCreate(BaseModel):
    name: str
    position: str
    company: str
    logo: str
    quote: str
    order: int = 0
    is_active: bool = True


class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    company: Optional[str] = None
    logo: Optional[str] = None
    quote: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Contact Submissions
class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    subject: str
    message: str


# Admin Users
class AdminUserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str


class AdminLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# Company Info
class CompanyInfoUpdate(BaseModel):
    company_name: Optional[str] = None
    tagline: Optional[str] = None
    about_us: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    established_year: Optional[int] = None
    iso_certifications: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
