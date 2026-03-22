"""
Project Detail API Tests
Tests for GET /api/public/projects/{project_id} endpoint and new project fields
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestProjectDetailEndpoint:
    """Tests for GET /api/public/projects/{project_id} endpoint"""
    
    @pytest.fixture
    def project_id(self):
        """Get a valid project ID from the projects list"""
        response = requests.get(f"{BASE_URL}/api/public/projects")
        projects = response.json()
        if len(projects) > 0:
            return projects[0]["_id"]
        pytest.skip("No projects available for testing")
    
    @pytest.fixture
    def manufacturing_project_id(self):
        """Get the Manufacturing Facilities project ID (has most complete data)"""
        response = requests.get(f"{BASE_URL}/api/public/projects")
        projects = response.json()
        for p in projects:
            if p["title"] == "Manufacturing Facilities":
                return p["_id"]
        # Fallback to first project
        if len(projects) > 0:
            return projects[0]["_id"]
        pytest.skip("No projects available for testing")
    
    def test_get_project_by_id_success(self, project_id):
        """GET /api/public/projects/{id} - returns project with all fields"""
        response = requests.get(f"{BASE_URL}/api/public/projects/{project_id}")
        assert response.status_code == 200
        data = response.json()
        
        # Basic fields
        assert "_id" in data
        assert data["_id"] == project_id
        assert "title" in data
        assert "category" in data
        assert "description" in data
        assert "client" in data
        assert "image" in data
        assert "is_active" in data
        print(f"✓ Project detail endpoint returns basic fields: {data['title']}")
    
    def test_project_has_new_fields(self, manufacturing_project_id):
        """GET /api/public/projects/{id} - returns new fields (gallery_images, location, area, etc.)"""
        response = requests.get(f"{BASE_URL}/api/public/projects/{manufacturing_project_id}")
        assert response.status_code == 200
        data = response.json()
        
        # New fields added for project detail page
        assert "gallery_images" in data
        assert isinstance(data["gallery_images"], list)
        
        assert "location" in data
        assert "area" in data
        assert "completion_date" in data
        assert "highlights" in data
        assert isinstance(data["highlights"], list)
        
        assert "scope" in data
        
        print(f"✓ Project has new fields: location={data.get('location')}, area={data.get('area')}")
        print(f"  gallery_images count: {len(data.get('gallery_images', []))}")
        print(f"  highlights count: {len(data.get('highlights', []))}")
    
    def test_project_has_related_projects(self, manufacturing_project_id):
        """GET /api/public/projects/{id} - returns related_projects from same category"""
        response = requests.get(f"{BASE_URL}/api/public/projects/{manufacturing_project_id}")
        assert response.status_code == 200
        data = response.json()
        
        assert "related_projects" in data
        assert isinstance(data["related_projects"], list)
        
        # Related projects should be from same category
        project_category = data["category"]
        for related in data["related_projects"]:
            assert related["category"] == project_category
            assert related["_id"] != data["_id"]  # Should not include current project
            assert "_id" in related
            assert "title" in related
            assert "image" in related
        
        print(f"✓ Related projects: {len(data['related_projects'])} projects in {project_category} category")
    
    def test_project_not_found(self):
        """GET /api/public/projects/{id} - returns 404 for non-existent project"""
        fake_id = "000000000000000000000000"  # Valid ObjectId format but doesn't exist
        response = requests.get(f"{BASE_URL}/api/public/projects/{fake_id}")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        print(f"✓ Non-existent project returns 404: {data['detail']}")
    
    def test_project_invalid_id_format(self):
        """GET /api/public/projects/{id} - returns 400 for invalid ObjectId format"""
        invalid_id = "invalid-id-format"
        response = requests.get(f"{BASE_URL}/api/public/projects/{invalid_id}")
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        print(f"✓ Invalid ID format returns 400: {data['detail']}")
    
    def test_manufacturing_project_has_complete_data(self, manufacturing_project_id):
        """Verify Manufacturing Facilities project has complete data for testing"""
        response = requests.get(f"{BASE_URL}/api/public/projects/{manufacturing_project_id}")
        assert response.status_code == 200
        data = response.json()
        
        # This project should have the most complete data
        assert data["title"] == "Manufacturing Facilities"
        assert len(data.get("gallery_images", [])) >= 2, "Should have at least 2 gallery images"
        assert len(data.get("highlights", [])) >= 5, "Should have at least 5 highlights"
        assert data.get("location"), "Should have location"
        assert data.get("area"), "Should have area"
        assert data.get("completion_date"), "Should have completion_date"
        assert data.get("scope"), "Should have scope"
        
        print(f"✓ Manufacturing Facilities has complete data:")
        print(f"  - Location: {data['location']}")
        print(f"  - Area: {data['area']}")
        print(f"  - Completion: {data['completion_date']}")
        print(f"  - Gallery images: {len(data['gallery_images'])}")
        print(f"  - Highlights: {len(data['highlights'])}")


class TestProjectDetailWithNewFields:
    """Tests for admin project CRUD with new fields"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin123"
        })
        return response.json()["access_token"]
    
    def test_create_project_with_new_fields(self, auth_token):
        """POST /api/admin/projects - create project with all new fields"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        create_data = {
            "title": "TEST_Project_Detail",
            "category": "Commercial",
            "description": "Test project for detail page testing",
            "client": "Test Client Corp",
            "image": "https://example.com/main.jpg",
            "gallery_images": [
                "https://example.com/gallery1.jpg",
                "https://example.com/gallery2.jpg"
            ],
            "location": "Test City, State",
            "area": "50,000 sq ft",
            "completion_date": "2025",
            "highlights": [
                "Highlight 1",
                "Highlight 2",
                "Highlight 3"
            ],
            "scope": "Complete civil and structural works for the test project.",
            "is_featured": False,
            "is_active": True
        }
        
        # CREATE
        create_response = requests.post(
            f"{BASE_URL}/api/admin/projects",
            json=create_data,
            headers=headers
        )
        assert create_response.status_code == 200
        created = create_response.json()
        project_id = created["_id"]
        
        # Verify all fields were saved
        assert created["title"] == "TEST_Project_Detail"
        assert created["gallery_images"] == create_data["gallery_images"]
        assert created["location"] == create_data["location"]
        assert created["area"] == create_data["area"]
        assert created["completion_date"] == create_data["completion_date"]
        assert created["highlights"] == create_data["highlights"]
        assert created["scope"] == create_data["scope"]
        print(f"✓ Created project with new fields: {project_id}")
        
        # GET via public API to verify
        get_response = requests.get(f"{BASE_URL}/api/public/projects/{project_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["gallery_images"] == create_data["gallery_images"]
        assert fetched["location"] == create_data["location"]
        assert "related_projects" in fetched
        print(f"✓ Public API returns project with new fields and related_projects")
        
        # CLEANUP - Delete test project
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/projects/{project_id}",
            headers=headers
        )
        assert delete_response.status_code == 200
        print(f"✓ Cleaned up test project")
    
    def test_update_project_new_fields(self, auth_token):
        """PUT /api/admin/projects/{id} - update project with new fields"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Create a test project first
        create_data = {
            "title": "TEST_Update_Fields",
            "category": "Industrial",
            "description": "Test project",
            "client": "Test Client",
            "image": "https://example.com/test.jpg",
            "is_active": True
        }
        create_response = requests.post(
            f"{BASE_URL}/api/admin/projects",
            json=create_data,
            headers=headers
        )
        project_id = create_response.json()["_id"]
        
        # Update with new fields
        update_data = {
            "gallery_images": ["https://example.com/new1.jpg"],
            "location": "Updated Location",
            "area": "75,000 sq ft",
            "completion_date": "2026",
            "highlights": ["New highlight 1", "New highlight 2"],
            "scope": "Updated scope description"
        }
        update_response = requests.put(
            f"{BASE_URL}/api/admin/projects/{project_id}",
            json=update_data,
            headers=headers
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        
        assert updated["gallery_images"] == update_data["gallery_images"]
        assert updated["location"] == update_data["location"]
        assert updated["area"] == update_data["area"]
        assert updated["highlights"] == update_data["highlights"]
        print(f"✓ Updated project with new fields")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/projects/{project_id}", headers=headers)
        print(f"✓ Cleaned up test project")


class TestContactFormForQuoteRequest:
    """Tests for contact form submission (used by Request Quote feature)"""
    
    def test_submit_quote_request(self):
        """POST /api/public/contact - submit quote request for a project"""
        contact_data = {
            "name": "TEST_Quote Requester",
            "email": "quote@example.com",
            "phone": "+91-9876543210",
            "subject": "Quote Request: Manufacturing Facilities",
            "message": "Project: Manufacturing Facilities\nCategory: Industrial\n\nI am interested in a similar project. Please provide a quote."
        }
        response = requests.post(f"{BASE_URL}/api/public/contact", json=contact_data)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "id" in data
        print(f"✓ Quote request submitted successfully: {data['id']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
