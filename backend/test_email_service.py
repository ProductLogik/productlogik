import os
import sys
import traceback
from dotenv import load_dotenv

# Ensure backend dir is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load env from .env file explicitly
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
load_dotenv(env_path)

print(f"Loading env from {env_path}")
print(f"RESEND_API_KEY: {os.getenv('RESEND_API_KEY')[:5]}...")

try:
    from services.email_service import email_service
    print("EmailService imported successfully.")
    
    print(f"Service enabled: {email_service.enabled}")
    
    if email_service.enabled:
        print("Attempting to send test email...")
        # Use a real email address if known, or test dummy
        sent = email_service.send_verification_email(
            to_email="test@example.com", 
            to_name="Test User", 
            verification_token="test-token-123"
        )
        print(f"Send result: {sent}")
    else:
        print("Service disabled, cannot test sending.")

except Exception as e:
    print(f"CRASH: {e}")
    import traceback
    traceback.print_exc()
