"""
Vastunirmana CMS API Tests
Tests for public and admin endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestPublicEndpoints:
    """Tests for public API endpoints"""
    
    def test_root_endpoint(self):
        """GET /api/ - root endpoint returns running message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "running" in data["message"].lower()
        print(f"✓ Root endpoint working: {data['message']}")
    
    def test_get_hero_slides(self):
        """GET /api/public/hero-slides - returns active hero slides"""
        response = requests.get(f"{BASE_URL}/api/public/hero-slides")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            slide = data[0]
            assert "_id" in slide
            assert "title" in slide
            assert "image" in slide
            assert "is_active" in slide
            assert slide["is_active"] == True
        print(f"✓ Hero slides endpoint working: {len(data)} slides returned")
    
    def test_get_capabilities(self):
        """GET /api/public/capabilities - returns active capabilities"""
        response = requests.get(f"{BASE_URL}/api/public/capabilities")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            capability = data[0]
            assert "_id" in capability
            assert "title" in capability
            assert "image" in capability
        print(f"✓ Capabilities endpoint working: {len(data)} capabilities returned")
    
    def test_get_projects(self):
        """GET /api/public/projects - returns active projects"""
        response = requests.get(f"{BASE_URL}/api/public/projects")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            project = data[0]
            assert "_id" in project
            assert "title" in project
            assert "category" in project
            assert "image" in project
        print(f"✓ Projects endpoint working: {len(data)} projects returned")
    
    def test_get_projects_with_category_filter(self):
        """GET /api/public/projects?category= - supports category filter"""
        response = requests.get(f"{BASE_URL}/api/public/projects?category=Industrial")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned projects should be Industrial category
        for project in data:
            assert project["category"] == "Industrial"
        print(f"✓ Projects category filter working: {len(data)} Industrial projects")
    
    def test_get_clients(self):
        """GET /api/public/clients - returns active clients"""
        response = requests.get(f"{BASE_URL}/api/public/clients")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            client = data[0]
            assert "_id" in client
            assert "name" in client
            assert "logo" in client
        print(f"✓ Clients endpoint working: {len(data)} clients returned")
    
    def test_get_testimonials(self):
        """GET /api/public/testimonials - returns active testimonials"""
        response = requests.get(f"{BASE_URL}/api/public/testimonials")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            testimonial = data[0]
            assert "_id" in testimonial
            assert "name" in testimonial
            assert "quote" in testimonial
        print(f"✓ Testimonials endpoint working: {len(data)} testimonials returned")
    
    def test_get_company_info(self):
        """GET /api/public/company-info - returns company info"""
        response = requests.get(f"{BASE_URL}/api/public/company-info")
        assert response.status_code == 200
        data = response.json()
        assert "_id" in data
        assert "company_name" in data
        assert "email" in data
        assert "phone" in data
        print(f"✓ Company info endpoint working: {data['company_name']}")
    
    def test_submit_contact_form(self):
        """POST /api/public/contact - submits contact form"""
        contact_data = {
            "name": "TEST_Contact User",
            "email": "test@example.com",
            "phone": "+91-9876543210",
            "subject": "Test Inquiry",
            "message": "This is a test message from automated testing."
        }
        response = requests.post(f"{BASE_URL}/api/public/contact", json=contact_data)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "id" in data
        print(f"✓ Contact form submission working: {data['message']}")
    
    def test_get_page_content_about(self):
        """GET /api/public/pages/about - returns about page content"""
        response = requests.get(f"{BASE_URL}/api/public/pages/about")
        # Page may or may not exist
        if response.status_code == 200:
            data = response.json()
            assert "_id" in data
            assert "page_name" in data
            print(f"✓ About page content exists")
        else:
            assert response.status_code == 404
            print(f"✓ About page not found (expected if not seeded)")
    
    def test_get_page_content_services(self):
        """GET /api/public/pages/services - returns services page content"""
        response = requests.get(f"{BASE_URL}/api/public/pages/services")
        if response.status_code == 200:
            data = response.json()
            assert "_id" in data
            print(f"✓ Services page content exists")
        else:
            assert response.status_code == 404
            print(f"✓ Services page not found (expected if not seeded)")
    
    def test_get_page_content_contact(self):
        """GET /api/public/pages/contact - returns contact page content"""
        response = requests.get(f"{BASE_URL}/api/public/pages/contact")
        if response.status_code == 200:
            data = response.json()
            assert "_id" in data
            print(f"✓ Contact page content exists")
        else:
            assert response.status_code == 404
            print(f"✓ Contact page not found (expected if not seeded)")


class TestAdminAuthentication:
    """Tests for admin authentication"""
    
    def test_admin_login_success(self):
        """POST /api/admin/login - login with admin/admin123 returns JWT token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
        print(f"✓ Admin login successful, token received")
    
    def test_admin_login_invalid_credentials(self):
        """POST /api/admin/login - invalid credentials returns 401"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "wrong",
            "password": "wrong"
        })
        assert response.status_code == 401
        print(f"✓ Invalid credentials correctly rejected")
    
    def test_admin_me_with_valid_token(self):
        """GET /api/admin/me - returns current admin user with valid token"""
        # First login
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        token = login_response.json()["access_token"]
        
        # Get current user
        response = requests.get(
            f"{BASE_URL}/api/admin/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "username" in data
        assert data["username"] == "admin"
        assert "password" not in data  # Password should not be returned
        print(f"✓ Admin me endpoint working: {data['username']}")
    
    def test_admin_me_without_token(self):
        """GET /api/admin/me - returns 403 without token"""
        response = requests.get(f"{BASE_URL}/api/admin/me")
        assert response.status_code == 403
        print(f"✓ Admin me correctly requires authentication")


class TestAdminDashboard:
    """Tests for admin dashboard"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        return response.json()["access_token"]
    
    def test_dashboard_stats(self, auth_token):
        """GET /api/admin/dashboard-stats - returns counts of all collections"""
        response = requests.get(
            f"{BASE_URL}/api/admin/dashboard-stats",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "hero_slides" in data
        assert "capabilities" in data
        assert "projects" in data
        assert "clients" in data
        assert "testimonials" in data
        assert "new_contacts" in data
        print(f"✓ Dashboard stats: {data}")


class TestAdminHeroSlidesCRUD:
    """Tests for admin hero slides CRUD operations"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        return response.json()["access_token"]
    
    def test_get_all_hero_slides(self, auth_token):
        """GET /api/admin/hero-slides - returns all hero slides"""
        response = requests.get(
            f"{BASE_URL}/api/admin/hero-slides",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin hero slides: {len(data)} slides")
    
    def test_create_update_delete_hero_slide(self, auth_token):
        """Full CRUD for /api/admin/hero-slides"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # CREATE
        create_data = {
            "title": "TEST_Slide",
            "subtitle": "Test Subtitle",
            "description": "Test Description",
            "image": "https://example.com/test.jpg",
            "order": 99,
            "is_active": True
        }
        create_response = requests.post(
            f"{BASE_URL}/api/admin/hero-slides",
            json=create_data,
            headers=headers
        )
        assert create_response.status_code == 200
        created = create_response.json()
        assert created["title"] == "TEST_Slide"
        slide_id = created["_id"]
        print(f"✓ Created hero slide: {slide_id}")
        
        # UPDATE
        update_data = {"title": "TEST_Slide_Updated"}
        update_response = requests.put(
            f"{BASE_URL}/api/admin/hero-slides/{slide_id}",
            json=update_data,
            headers=headers
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["title"] == "TEST_Slide_Updated"
        print(f"✓ Updated hero slide")
        
        # DELETE
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/hero-slides/{slide_id}",
            headers=headers
        )
        assert delete_response.status_code == 200
        print(f"✓ Deleted hero slide")


class TestAdminCapabilitiesCRUD:
    """Tests for admin capabilities CRUD operations"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        return response.json()["access_token"]
    
    def test_crud_capabilities(self, auth_token):
        """Full CRUD for /api/admin/capabilities"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # CREATE
        create_data = {
            "title": "TEST_Capability",
            "image": "https://example.com/test.jpg",
            "description": "Test capability",
            "order": 99,
            "is_active": True
        }
        create_response = requests.post(
            f"{BASE_URL}/api/admin/capabilities",
            json=create_data,
            headers=headers
        )
        assert create_response.status_code == 200
        created = create_response.json()
        capability_id = created["_id"]
        print(f"✓ Created capability: {capability_id}")
        
        # UPDATE
        update_response = requests.put(
            f"{BASE_URL}/api/admin/capabilities/{capability_id}",
            json={"title": "TEST_Capability_Updated"},
            headers=headers
        )
        assert update_response.status_code == 200
        print(f"✓ Updated capability")
        
        # DELETE
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/capabilities/{capability_id}",
            headers=headers
        )
        assert delete_response.status_code == 200
        print(f"✓ Deleted capability")


class TestAdminProjectsCRUD:
    """Tests for admin projects CRUD operations"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        return response.json()["access_token"]
    
    def test_crud_projects(self, auth_token):
        """Full CRUD for /api/admin/projects"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # CREATE
        create_data = {
            "title": "TEST_Project",
            "category": "Industrial",
            "description": "Test project description",
            "client": "Test Client",
            "image": "https://example.com/test.jpg",
            "is_featured": False,
            "is_active": True
        }
        create_response = requests.post(
            f"{BASE_URL}/api/admin/projects",
            json=create_data,
            headers=headers
        )
        assert create_response.status_code == 200
        created = create_response.json()
        project_id = created["_id"]
        print(f"✓ Created project: {project_id}")
        
        # UPDATE
        update_response = requests.put(
            f"{BASE_URL}/api/admin/projects/{project_id}",
            json={"title": "TEST_Project_Updated"},
            headers=headers
        )
        assert update_response.status_code == 200
        print(f"✓ Updated project")
        
        # DELETE
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/projects/{project_id}",
            headers=headers
        )
        assert delete_response.status_code == 200
        print(f"✓ Deleted project")


class TestAdminClientsCRUD:
    """Tests for admin clients CRUD operations"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        return response.json()["access_token"]
    
    def test_crud_clients(self, auth_token):
        """Full CRUD for /api/admin/clients"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # CREATE
        create_data = {
            "name": "TEST_Client",
            "logo": "https://example.com/logo.jpg",
            "order": 99,
            "is_active": True
        }
        create_response = requests.post(
            f"{BASE_URL}/api/admin/clients",
            json=create_data,
            headers=headers
        )
        assert create_response.status_code == 200
        created = create_response.json()
        client_id = created["_id"]
        print(f"✓ Created client: {client_id}")
        
        # UPDATE
        update_response = requests.put(
            f"{BASE_URL}/api/admin/clients/{client_id}",
            json={"name": "TEST_Client_Updated"},
            headers=headers
        )
        assert update_response.status_code == 200
        print(f"✓ Updated client")
        
        # DELETE
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/clients/{client_id}",
            headers=headers
        )
        assert delete_response.status_code == 200
        print(f"✓ Deleted client")


class TestAdminTestimonialsCRUD:
    """Tests for admin testimonials CRUD operations"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        return response.json()["access_token"]
    
    def test_crud_testimonials(self, auth_token):
        """Full CRUD for /api/admin/testimonials"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # CREATE
        create_data = {
            "name": "TEST_Person",
            "position": "CEO",
            "company": "Test Company",
            "logo": "https://example.com/logo.jpg",
            "quote": "Great service!",
            "order": 99,
            "is_active": True
        }
        create_response = requests.post(
            f"{BASE_URL}/api/admin/testimonials",
            json=create_data,
            headers=headers
        )
        assert create_response.status_code == 200
        created = create_response.json()
        testimonial_id = created["_id"]
        print(f"✓ Created testimonial: {testimonial_id}")
        
        # UPDATE
        update_response = requests.put(
            f"{BASE_URL}/api/admin/testimonials/{testimonial_id}",
            json={"name": "TEST_Person_Updated"},
            headers=headers
        )
        assert update_response.status_code == 200
        print(f"✓ Updated testimonial")
        
        # DELETE
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/testimonials/{testimonial_id}",
            headers=headers
        )
        assert delete_response.status_code == 200
        print(f"✓ Deleted testimonial")


class TestAdminCompanyInfo:
    """Tests for admin company info endpoints"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        return response.json()["access_token"]
    
    def test_get_company_info(self, auth_token):
        """GET /api/admin/company-info"""
        response = requests.get(
            f"{BASE_URL}/api/admin/company-info",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "company_name" in data
        print(f"✓ Admin company info: {data['company_name']}")
    
    def test_update_company_info(self, auth_token):
        """PUT /api/admin/company-info"""
        # Get current info
        get_response = requests.get(
            f"{BASE_URL}/api/admin/company-info",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        original_tagline = get_response.json().get("tagline", "")
        
        # Update
        update_response = requests.put(
            f"{BASE_URL}/api/admin/company-info",
            json={"tagline": "TEST_Updated Tagline"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        print(f"✓ Updated company info")
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/admin/company-info",
            json={"tagline": original_tagline},
            headers={"Authorization": f"Bearer {auth_token}"}
        )


class TestAdminContacts:
    """Tests for admin contacts endpoints"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        return response.json()["access_token"]
    
    def test_get_contacts(self, auth_token):
        """GET /api/admin/contacts"""
        response = requests.get(
            f"{BASE_URL}/api/admin/contacts",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin contacts: {len(data)} contacts")


class TestAdminPages:
    """Tests for admin pages endpoints"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        return response.json()["access_token"]
    
    def test_get_all_pages(self, auth_token):
        """GET /api/admin/pages"""
        response = requests.get(
            f"{BASE_URL}/api/admin/pages",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin pages: {len(data)} pages")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
