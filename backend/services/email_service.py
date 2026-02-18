import os
import resend
from typing import Optional
import traceback
import logging

class EmailService:
    def __init__(self):
        """Initialize Resend email service"""
        api_key = os.getenv("RESEND_API_KEY")
        logging.info(f"DEBUG: Initializing EmailService. Key present: {bool(api_key)}")
        if api_key:
            logging.info(f"DEBUG: Key value (first 4): {api_key[:4] if len(api_key) > 4 else 'SHORT'}")
        
        if api_key and api_key != "your_resend_api_key_here":
            resend.api_key = api_key
            self.enabled = True
            logging.info("✅ Email service initialized (Resend)")
        else:
            self.enabled = False
            logging.info(f"⚠️  Email service disabled. Key: {api_key}")
        
        self.from_email = os.getenv("FROM_EMAIL", "ProductLogik <no-reply@productlogik.com>")
        
        # Handle FRONTEND_URL (support multiple for CORS, but pick first for links)
        raw_urls = os.getenv("FRONTEND_URL", "http://localhost:5173")
        url_list = [u.strip() for u in raw_urls.split(",") if u.strip()]
        self.frontend_url = url_list[0] if url_list else "http://localhost:5173"
        
        logging.info(f"✅ EmailService initialized (Frontend URL: {self.frontend_url})")
    
    def send_invitation_email(
        self,
        to_email: str,
        from_user_name: str,
        upload_filename: str,
        share_id: str
    ) -> bool:
        """
        Send invitation email to unregistered user.
        
        Args:
            to_email: Email of invited user
            from_user_name: Name of user who shared
            upload_filename: Name of shared file
            share_id: ID of the share
            
        Returns:
            True if sent successfully, False otherwise
        """
        if not self.enabled:
            print(f"[!] Email not sent (service disabled): Invitation to {to_email}")
            return False
        
        try:
            signup_link = f"{self.frontend_url}/signup?email={to_email}&invite={share_id}"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {{ 
                        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        line-height: 1.6;
                        color: #1F2933;
                        margin: 0;
                        padding: 0;
                        background-color: #F9FAFB;
                    }}
                    .container {{ 
                        max-width: 600px;
                        margin: 40px auto;
                        background: white;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    }}
                    .header {{ 
                        background: linear-gradient(135deg, #059669 0%, #047857 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }}
                    .logo-text {{
                        font-size: 24px;
                        font-weight: 800;
                        color: white;
                        text-decoration: none;
                        display: inline-block;
                        margin-bottom: 10px;
                    }}
                    .header h1 {{
                        margin: 10px 0 0 0;
                        font-size: 28px;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                    }}
                    .content {{ 
                        padding: 40px 30px;
                        background: white;
                    }}
                    .content p {{
                        margin: 0 0 16px 0;
                        color: #1F2933;
                        font-size: 16px;
                    }}
                    .file-badge {{
                        background: #F9FAFB;
                        padding: 20px;
                        border-left: 4px solid #059669;
                        border-radius: 8px;
                        margin: 24px 0;
                    }}
                    .file-badge strong {{
                        color: #059669;
                        font-size: 18px;
                    }}
                    .button {{ 
                        display: inline-block;
                        background: #059669;
                        color: white !important;
                        padding: 14px 32px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        margin: 24px 0;
                        transition: background 0.2s;
                    }}
                    .button:hover {{
                        background: #047857;
                    }}
                    .button-container {{
                        text-align: center;
                        margin: 32px 0;
                    }}
                    .info-text {{
                        color: #4B5563;
                        font-size: 14px;
                        margin-top: 24px;
                        padding-top: 24px;
                        border-top: 1px solid #E5E7EB;
                    }}
                    .footer {{ 
                        text-align: center;
                        padding: 24px 30px;
                        background: #F9FAFB;
                        color: #4B5563;
                        font-size: 13px;
                    }}
                    .footer p {{
                        margin: 8px 0;
                    }}
                    .logo {{
                        font-size: 20px;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                        margin-bottom: 8px;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
<div class="logo-container" style="text-align: center; margin-bottom: 20px;">
                            <img src="{self.frontend_url}/logo.png" alt="ProductLogik" style="max-height: 50px; width: auto; display: block; margin: 0 auto;" class="logo-img">
                        </div>
                        <h1>You've Been Invited!</h1>
                    </div>
                    <div class="content">
                        <p>Hi there!</p>
                        <p><strong>{from_user_name}</strong> has shared feedback analysis with you on ProductLogik:</p>
                        <div class="file-badge">
                            <strong>📄 {upload_filename}</strong>
                        </div>
                        <p>ProductLogik uses AI to analyze customer feedback and discover key themes, insights, and patterns automatically.</p>
                        <div class="button-container">
                            <a href="{signup_link}" class="button">Create Free Account & View Analysis</a>
                        </div>
                        <p class="info-text">
                            <strong>What you'll get:</strong><br>
                            ✓ AI-powered theme extraction<br>
                            ✓ Sentiment analysis<br>
                            ✓ Key insights and evidence quotes<br>
                            ✓ Free tier with 5 analyses/month
                        </p>
                    </div>
                    <div class="footer">
                        <p>This invitation was sent by {from_user_name}</p>
                        <p style="color: #9CA3AF; margin-top: 16px;">© 2026 ProductLogik. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": f"{from_user_name} invited you to view feedback analysis",
                "html": html_content
            }
            
            response = resend.Emails.send(params)
            print(f"✅ Invitation email sent to {to_email} (ID: {response['id']})")
            return True
            
        except Exception as e:
            print(f"[X] Failed to send invitation email to {to_email}: {e}")
            return False
    
    def send_share_notification_email(
        self,
        to_email: str,
        to_name: str,
        from_user_name: str,
        upload_filename: str,
        upload_id: str
    ) -> bool:
        """
        Send notification email to registered user when upload is shared.
        
        Args:
            to_email: Email of user being notified
            to_name: Name of user being notified
            from_user_name: Name of user who shared
            upload_filename: Name of shared file
            upload_id: ID of the upload
            
        Returns:
            True if sent successfully, False otherwise
        """
        if not self.enabled:
            print(f"📧 Email not sent (service disabled): Share notification to {to_email}")
            return False
        
        try:
            view_link = f"{self.frontend_url}/results/{upload_id}"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {{ 
                        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        line-height: 1.6;
                        color: #1F2933;
                        margin: 0;
                        padding: 0;
                        background-color: #F9FAFB;
                    }}
                    .container {{ 
                        max-width: 600px;
                        margin: 40px auto;
                        background: white;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    }}
                    .header {{ 
                        background: linear-gradient(135deg, #059669 0%, #047857 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }}
                    .logo-container {{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        margin-bottom: 20px;
                    }}
                    .logo-img {{
                        width: 40px;
                        height: 40px;
                        display: block;
                    }}
                    .logo-text {{
                        font-size: 24px;
                        font-weight: 800;
                        color: white;
                        text-decoration: none;
                        display: block;
                    }}
                    .header h1 {{
                        margin: 10px 0 0 0;
                        font-size: 28px;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                    }}
                    .content {{ 
                        padding: 40px 30px;
                        background: white;
                    }}
                    .content p {{
                        margin: 0 0 16px 0;
                        color: #1F2933;
                        font-size: 16px;
                    }}
                    .file-badge {{
                        background: #F9FAFB;
                        padding: 20px;
                        border-left: 4px solid #059669;
                        border-radius: 8px;
                        margin: 24px 0;
                    }}
                    .file-badge strong {{
                        color: #059669;
                        font-size: 18px;
                    }}
                    .button {{ 
                        display: inline-block;
                        background: #059669;
                        color: white !important;
                        padding: 14px 32px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        margin: 24px 0;
                        transition: background 0.2s;
                    }}
                    .button:hover {{
                        background: #047857;
                    }}
                    .button-container {{
                        text-align: center;
                        margin: 32px 0;
                    }}
                    .footer {{ 
                        text-align: center;
                        padding: 24px 30px;
                        background: #F9FAFB;
                        color: #4B5563;
                        font-size: 13px;
                    }}
                    .footer p {{
                        margin: 8px 0;
                    }}
                    .logo {{
                        font-size: 20px;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                        margin-bottom: 8px;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo-container" style="text-align: center; margin-bottom: 20px;">
                            <img src="{self.frontend_url}/logo.png" alt="ProductLogik" style="max-height: 50px; width: auto; display: block; margin: 0 auto;" class="logo-img">
                        </div>
                        <h1>New Analysis Shared</h1>
                    </div>
                    <div class="content">
                        <p>Hi {to_name}!</p>
                        <p><strong>{from_user_name}</strong> has shared feedback analysis with you:</p>
                        <div class="file-badge">
                            <strong>📄 {upload_filename}</strong>
                        </div>
                        <p>You can now view the AI-powered analysis, themes, sentiment insights, and key evidence quotes.</p>
                        <div class="button-container">
                            <a href="{view_link}" class="button">View Analysis Now</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This analysis was shared by {from_user_name}</p>
                        <p style="color: #9CA3AF; margin-top: 16px;">© 2026 ProductLogik. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": f"{from_user_name} shared \"{upload_filename}\" with you",
                "html": html_content
            }
            
            response = resend.Emails.send(params)
            print(f"✅ Share notification sent to {to_email} (ID: {response['id']})")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send share notification to {to_email}: {e}")
            return False
    
    def send_verification_email(
        self,
        to_email: str,
        to_name: str,
        verification_token: str
    ) -> bool:
        """
        Send email verification link to new user.
        
        Args:
            to_email: Email of new user
            to_name: Name of new user
            verification_token: Verification token
            
        Returns:
            True if sent successfully, False otherwise
        """
        if not self.enabled:
            print(f"📧 Email not sent (service disabled): Verification to {to_email}")
            return False
        
        try:
            verify_link = f"{self.frontend_url}/verify-email?token={verification_token}"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {{ 
                        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        line-height: 1.6;
                        color: #1F2933;
                        margin: 0;
                        padding: 0;
                        background-color: #F9FAFB;
                    }}
                    .container {{ 
                        max-width: 600px;
                        margin: 40px auto;
                        background: white;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    }}
                    .header {{ 
                        background: linear-gradient(135deg, #059669 0%, #047857 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }}
                    .logo-container {{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        margin-bottom: 20px;
                    }}
                    .logo-img {{
                        width: 40px;
                        height: 40px;
                        display: block;
                    }}
                    .logo-text {{
                        font-size: 24px;
                        font-weight: 800;
                        color: white;
                        text-decoration: none;
                        display: block;
                    }}
                    .header h1 {{
                        margin: 10px 0 0 0;
                        font-size: 28px;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                    }}
                    .content {{ 
                        padding: 40px 30px;
                        background: white;
                    }}
                    .content p {{
                        margin: 0 0 16px 0;
                        color: #1F2933;
                        font-size: 16px;
                    }}
                    .button {{ 
                        display: inline-block;
                        background: #059669;
                        color: white !important;
                        padding: 14px 32px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        margin: 24px 0;
                        transition: background 0.2s;
                    }}
                    .button:hover {{
                        background: #047857;
                    }}
                    .button-container {{
                        text-align: center;
                        margin: 32px 0;
                    }}
                    .info-box {{
                        background: #F9FAFB;
                        padding: 20px;
                        border-left: 4px solid #059669;
                        border-radius: 8px;
                        margin: 24px 0;
                    }}
                    .footer {{ 
                        text-align: center;
                        padding: 24px 30px;
                        background: #F9FAFB;
                        color: #4B5563;
                        font-size: 13px;
                    }}
                    .footer p {{
                        margin: 8px 0;
                    }}
                    .logo {{
                        font-size: 20px;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                        margin-bottom: 8px;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo-container" style="text-align: center; margin-bottom: 20px;">
                            <img src="{self.frontend_url}/logo.png" alt="ProductLogik" style="max-height: 50px; width: auto; display: block; margin: 0 auto;" class="logo-img">
                        </div>
                        <h1>Verify Your Email</h1>
                    </div>
                    <div class="content">
                        <p>Hi {to_name}!</p>
                        <p>Welcome to ProductLogik! Please verify your email address to activate your account and start analyzing feedback.</p>
                        <div class="button-container">
                            <a href="{verify_link}" class="button">Verify Email Address</a>
                        </div>
                        <div class="info-box">
                            <p style="margin: 0; color: #4B5563; font-size: 14px;">
                                <strong>Why verify?</strong><br>
                                Email verification helps us keep your account secure and ensures you can recover your password if needed.
                            </p>
                        </div>
                        <p style="color: #4B5563; font-size: 14px;">
                            If you didn't create this account, you can safely ignore this email.
                        </p>
                    </div>
                    <div class="footer">
                        <p>This verification link will expire in 24 hours</p>
                        <p style="color: #9CA3AF; margin-top: 16px;">© 2026 ProductLogik. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": "Verify your ProductLogik account",
                "html": html_content
            }
            
            response = resend.Emails.send(params)
            logging.info(f"✅ Verification email sent to {to_email} (ID: {response['id']})")
            return True
            
        except Exception as e:
            logging.error(f"❌ Failed to send verification email to {to_email}: {e}")
            logging.error(traceback.format_exc())
            return False

# Create singleton instance
email_service = EmailService()
