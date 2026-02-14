import requests
import time
import subprocess
import sys
import os

# Base URL (Assuming default FastAPI port)
BASE_URL = "http://127.0.0.1:8000"

def test_auth():
    print("--- Testing Authentication System ---")

    # 1. Register a new user
    # Using timestamp to ensure unique email each run
    test_email = f"test_{int(time.time())}@example.com"
    test_password = "securepassword123"
    
    print(f"\n1. Attempting to Register: {test_email}")
    
    register_payload = {
        "email": test_email,
        "password": test_password,
        "full_name": "Test User",
        "company_name": "Test Corp"
    }

    try:
        reg_response = requests.post(f"{BASE_URL}/api/auth/register", json=register_payload)
        
        if reg_response.status_code == 200:
            print("   SUCCESS! User registered.")
            print(f"   Token received: {reg_response.json().get('access_token')[:20]}...")
        else:
            print(f"   FAILED: {reg_response.status_code} - {reg_response.text}")
            return

    except requests.exceptions.ConnectionError:
        print("   FAILED: Could not connect to backend. Is the server running?")
        print("   Run: uvicorn main:app --reload in the backend directory.")
        return

    # 2. Login (Get Token)
    print(f"\n2. Attempting to Login (Get Token)")
    
    login_payload = {
        "username": test_email, # OAuth2 spec uses 'username' field
        "password": test_password
    }

    try:
        login_response = requests.post(f"{BASE_URL}/api/auth/token", data=login_payload)
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            print("   SUCCESS! Login successful.")
            print(f"   Access Token: {token_data.get('access_token')[:20]}...")
            print(f"   Token Type: {token_data.get('token_type')}")
        else:
            print(f"   FAILED: {login_response.status_code} - {login_response.text}")

    except Exception as e:
        print(f"   ERROR: {e}")

if __name__ == "__main__":
    test_auth()
