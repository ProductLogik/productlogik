import os
import sys
import logging
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Setup paths and logging
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
logging.basicConfig(level=logging.INFO)

# Load env variables
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
load_dotenv(env_path)

# Mock EmailService BEFORE importing auty/main
import services.email_service
# Monkey patch send_verification_email to always succeed
def mock_send_email(*args, **kwargs):
    print("MOCK: Email sent successfully")
    return True
services.email_service.email_service.send_verification_email = mock_send_email

from main import app, get_db
from database import Base, get_db as real_get_db

# Test Client
client = TestClient(app)

# Generate unique email
import time
email = f"test_verify_{int(time.time())}@example.com"
password = "TestPassword123!"

def test_flow():
    print(f"--- Testing Verification Flow for {email} ---")
    
    # 1. Register
    print("1. Registering user...")
    response = client.post("/api/auth/register", json={
        "email": email,
        "password": password,
        "full_name": "Test User",
        "company_name": "Test Corp"
    })
    
    if response.status_code != 200:
        print(f"❌ Registration Failed: {response.text}")
        return False
        
    print(f"✅ Registration Success: {response.json()}")
    
    # 2. Extract Token from DB directly (since email is mocked)
    # We need to connect to DB to get the token
    from database import SessionLocal
    db = SessionLocal()
    from models import User
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print("❌ User not found in DB!")
        return False
        
    token = user.verification_token
    print(f"✅ User found. Token: {token}")
    
    if not token:
        print("❌ No verification token generated!")
        return False
        
    # 3. Verify Email via API
    print(f"3. Verifying email with token: {token}")
    verify_response = client.get(f"/api/auth/verify-email?token={token}")
    
    if verify_response.status_code != 200:
        print(f"❌ Verification API Failed: {verify_response.text}")
        
        # Check if it was 405 Method Not Allowed (would mean POST vs GET issue still exists)
        if verify_response.status_code == 405:
            print("❌ Error 405: Method Not Allowed. Endpoint might be POST?")
            
        return False
        
    print(f"✅ Verification API Success: {verify_response.json()}")
    
    # 4. Login
    print("4. Attempting Login...")
    login_response = client.post("/api/auth/token", data={
        "username": email,
        "password": password
    })
    
    if login_response.status_code != 200:
        print(f"❌ Login Failed: {login_response.text}")
        return False
        
    print(f"✅ Login Success: {login_response.json().get('token_type')}")
    return True

if __name__ == "__main__":
    try:
        if test_flow():
            print("\n🎉 FULL FLOW SUCCESS")
            sys.exit(0)
        else:
            print("\n💀 FLOW FAILED")
            sys.exit(1)
    except Exception as e:
        print(f"CRASH: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
