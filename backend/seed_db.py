from motor.motor_asyncio import AsyncIOMotorClient
from auth import get_password_hash
from datetime import datetime
import os
import asyncio

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


async def seed_database():
    print("Seeding database...")
    
    # Check if admin user already exists
    existing_admin = await db.admin_users.find_one({"username": "admin"})
    if not existing_admin:
        admin_user = {
            "username": "admin",
            "email": "admin@vastunirmana.com",
            "password": get_password_hash("admin123"),
            "full_name": "Admin User",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "last_login": None
        }
        await db.admin_users.insert_one(admin_user)
        print("✓ Admin user created (username: admin, password: admin123)")
    else:
        print("✓ Admin user already exists")
    
    # Check if hero slides exist
    existing_slides = await db.hero_slides.count_documents({})
    if existing_slides == 0:
        hero_slides = [
            {
                "title": "TOP Construction",
                "subtitle": "Company in India",
                "description": "Executed more than 100 Building Projects",
                "image": "https://images.unsplash.com/photo-1599995903128-531fc7fb694b?crop=entropy&cs=srgb&fm=jpg&q=85",
                "order": 1,
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "title": "We Build",
                "subtitle": "Your Dream",
                "description": "We shape our buildings; thereafter, they shape us",
                "image": "https://images.unsplash.com/photo-1694521787162-5373b598945c?crop=entropy&cs=srgb&fm=jpg&q=85",
                "order": 2,
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "title": "From concept",
                "subtitle": "to creation.",
                "description": "We shape our buildings; thereafter, they shape us",
                "image": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=srgb&fm=jpg&q=85",
                "order": 3,
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "title": "Making dreams",
                "subtitle": "come to life",
                "description": "We shape our buildings; thereafter, they shape us",
                "image": "https://images.pexels.com/photos/35300832/pexels-photo-35300832.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "order": 4,
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        await db.hero_slides.insert_many(hero_slides)
        print(f"✓ {len(hero_slides)} hero slides created")
    else:
        print(f"✓ Hero slides already exist ({existing_slides} slides)")
    
    # Seed capabilities
    existing_capabilities = await db.capabilities.count_documents({})
    if existing_capabilities == 0:
        capabilities = [
            {"title": "Excavation Works", "image": "https://images.unsplash.com/photo-1769721209842-e46c60e7fbf9?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "", "order": 1, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Piling & Dewatering Works", "image": "https://images.unsplash.com/photo-1761877676992-0c232a7920f2?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "", "order": 2, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Earth Retention Works", "image": "https://images.unsplash.com/photo-1759269106004-ae48d47d4955?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "", "order": 3, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Industrial Sheds - MS Works", "image": "https://images.unsplash.com/photo-1615797534094-7fde0a4861f3?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "", "order": 4, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Industrial Flooring", "image": "https://images.unsplash.com/photo-1600313419152-c66124a3b727?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "", "order": 5, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Road Works", "image": "https://images.unsplash.com/photo-1629219857214-02b302d42272?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "", "order": 6, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Steel Structure Works", "image": "https://images.pexels.com/photos/416435/pexels-photo-416435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "description": "", "order": 7, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "RCC Works (Flatted Development)", "image": "https://images.pexels.com/photos/2083391/pexels-photo-2083391.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "description": "", "order": 8, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "RCC Works (High Rise Development)", "image": "https://images.pexels.com/photos/2566070/pexels-photo-2566070.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "description": "", "order": 9, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "MEP Works", "image": "https://images.pexels.com/photos/3818947/pexels-photo-3818947.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "description": "", "order": 10, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Facade Works", "image": "https://images.pexels.com/photos/26200673/pexels-photo-26200673.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "description": "", "order": 11, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Finishing Works (Internal Finishes)", "image": "https://images.unsplash.com/photo-1599995903128-531fc7fb694b?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "", "order": 12, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()}
        ]
        await db.capabilities.insert_many(capabilities)
        print(f"✓ {len(capabilities)} capabilities created")
    else:
        print(f"✓ Capabilities already exist ({existing_capabilities} capabilities)")
    
    # Seed projects
    existing_projects = await db.projects.count_documents({})
    if existing_projects == 0:
        projects = [
            {"title": "Manufacturing Facilities", "category": "Industrial", "description": "Civil Works of 15+ Buildings spread over 100 Acres", "client": "Leading Manufacturing Company", "image": "https://images.unsplash.com/photo-1615797534094-7fde0a4861f3?crop=entropy&cs=srgb&fm=jpg&q=85", "is_featured": True, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Corporate Office Building", "category": "Commercial", "description": "Steel Structure Works (4 Basements)", "client": "Corporate Group", "image": "https://images.unsplash.com/photo-1600313419152-c66124a3b727?crop=entropy&cs=srgb&fm=jpg&q=85", "is_featured": False, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "IT Park & Corporate Office", "category": "Commercial", "description": "11 Storied + Double Basement Green Building", "client": "IT Company", "image": "https://images.unsplash.com/photo-1629219857214-02b302d42272?crop=entropy&cs=srgb&fm=jpg&q=85", "is_featured": False, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Factory & Office Complex", "category": "Industrial", "description": "LEED Platinum Rated Green Building", "client": "Manufacturing Company", "image": "https://images.pexels.com/photos/416435/pexels-photo-416435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "is_featured": False, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Management Complex", "category": "Institutional", "description": "Modern RCC Structure in Indo Arabic architecture", "client": "Educational Institution", "image": "https://images.pexels.com/photos/2083391/pexels-photo-2083391.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "is_featured": False, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Public School", "category": "Institutional", "description": "(10+2) Level, 4 Storied, RCC Framework", "client": "Educational Trust", "image": "https://images.pexels.com/photos/2566070/pexels-photo-2566070.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "is_featured": False, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Residential Towers", "category": "Residential", "description": "2 Towers, G+12 Storied with Civil, Structure, Finishing & MEP Works", "client": "Real Estate Group", "image": "https://images.pexels.com/photos/3818947/pexels-photo-3818947.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "is_featured": False, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"title": "Corporate Headquarters", "category": "Commercial", "description": "15 Stories + 2 Basements, Large span PT slab RCC Structure", "client": "Corporate Ltd.", "image": "https://images.pexels.com/photos/26200673/pexels-photo-26200673.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "is_featured": False, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()}
        ]
        await db.projects.insert_many(projects)
        print(f"✓ {len(projects)} projects created")
    else:
        print(f"✓ Projects already exist ({existing_projects} projects)")
    
    # Seed clients
    existing_clients = await db.clients.count_documents({})
    if existing_clients == 0:
        clients = [
            {"name": "Unilever", "logo": "https://via.placeholder.com/200x100/ffffff/FF8C42?text=Unilever", "order": 1, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "DLF", "logo": "https://via.placeholder.com/200x100/ffffff/FF8C42?text=DLF", "order": 2, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "Tata Realty", "logo": "https://via.placeholder.com/200x100/ffffff/FF8C42?text=Tata+Realty", "order": 3, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "Air Liquide", "logo": "https://via.placeholder.com/200x100/ffffff/FF8C42?text=Air+Liquide", "order": 4, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "Client 5", "logo": "https://via.placeholder.com/200x100/ffffff/FF8C42?text=Client+5", "order": 5, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "Client 6", "logo": "https://via.placeholder.com/200x100/ffffff/FF8C42?text=Client+6", "order": 6, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "Client 7", "logo": "https://via.placeholder.com/200x100/ffffff/FF8C42?text=Client+7", "order": 7, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "Client 8", "logo": "https://via.placeholder.com/200x100/ffffff/FF8C42?text=Client+8", "order": 8, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "Client 9", "logo": "https://via.placeholder.com/200x100/ffffff/FF8C42?text=Client+9", "order": 9, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "Client 10", "logo": "https://via.placeholder.com/200x100/ffffff/FF8C42?text=Client+10", "order": 10, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()}
        ]
        await db.clients.insert_many(clients)
        print(f"✓ {len(clients)} clients created")
    else:
        print(f"✓ Clients already exist ({existing_clients} clients)")
    
    # Seed testimonials
    existing_testimonials = await db.testimonials.count_documents({})
    if existing_testimonials == 0:
        testimonials = [
            {"name": "R.P. Singh", "position": "President – Projects", "company": "Corporate Group", "logo": "https://via.placeholder.com/150x80/ffffff/FF8C42?text=Company+Logo", "quote": "We engaged your service to construct our 15 storied building to serve as our Northern India Headquarters. We would like to officially put on record that your organization has always performed professionally, your commitment to quality and the extraordinary efforts in ensuring the ultimate success of this project was wonderful. I look forward to working with your organisation again soon.", "order": 1, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "Young Man Hoo", "position": "Project Director", "company": "Engineering Corporation", "logo": "https://via.placeholder.com/150x80/ffffff/FF8C42?text=Engineering+Corp", "quote": "We are very excited to partner with Vastunirmana. They have a very capable & highly motivated team. They recently executed the excavation and shoring works for our project. We are confident that the team will achieve the desired results within the given time frame while maintaining our quality standards.", "order": 2, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
            {"name": "Yang Jae Won", "position": "Chief Civil Manager", "company": "Engineering Corporation", "logo": "https://via.placeholder.com/150x80/ffffff/FF8C42?text=Engineering+LLP", "quote": "There was a lot riding on the success & timely completion of construction of our project. Your team faced all the challenges of the project head on and came over them effectively cooperating with our team. I wouldn't hesitate to recommend Vastunirmana for anyone looking for a Construction agency for their large-scale project.", "order": 3, "is_active": True, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()}
        ]
        await db.testimonials.insert_many(testimonials)
        print(f"✓ {len(testimonials)} testimonials created")
    else:
        print(f"✓ Testimonials already exist ({existing_testimonials} testimonials)")
    
    # Seed company info
    existing_company_info = await db.company_info.count_documents({})
    if existing_company_info == 0:
        company_info = {
            "company_name": "Vastunirmana Projects Pvt. Ltd.",
            "tagline": "Building Dreams, Creating Landmarks",
            "about_us": "Established in 1986, Vastunirmana Projects Pvt. Ltd. is one of the top construction companies in Northern India.",
            "email": "office@vastunirmana.com",
            "phone": "+91-0120-2651155",
            "address": "Noida, Delhi, Gurugram, Lucknow, Jaipur",
            "established_year": 1986,
            "iso_certifications": "ISO 9001 : 2015 | ISO 14001 : 2015 | ISO 45001 : 2018 Certified",
            "social_links": {
                "facebook": "#",
                "twitter": "#",
                "linkedin": "#",
                "youtube": "#"
            },
            "updated_at": datetime.utcnow()
        }
        await db.company_info.insert_one(company_info)
        print("✓ Company info created")
    else:
        print("✓ Company info already exists")
    
    print("\n✅ Database seeding completed!")
    print("\n📝 Admin Credentials:")
    print("   Username: admin")
    print("   Password: admin123")
    print("\n⚠️  Please change the admin password after first login!")


if __name__ == "__main__":
    asyncio.run(seed_database())
