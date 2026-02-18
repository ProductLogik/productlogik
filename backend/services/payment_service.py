import stripe
from fastapi import HTTPException, Request
from sqlalchemy.orm import Session
from models import User, UsageQuota
import os
from datetime import datetime

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
# Handle FRONTEND_URL (pick first one if multiple are provided for CORS)
_frontend_urls = [u.strip() for u in os.getenv("FRONTEND_URL", "http://localhost:5173").split(",") if u.strip()]
FRONTEND_URL = _frontend_urls[0] if _frontend_urls else "http://localhost:5173"

# Plan Configuration (Map Price IDs to Tiers)
# Replace these with real Stripe Price IDs in Production
PLAN_PRICES = {
    os.getenv("STRIPE_PRICE_PRO_MONTHLY", "price_1T1wUDAoUwXHg17S3OYd4yc5"): {"tier": "pro", "limit": 50},
    os.getenv("STRIPE_PRICE_TEAM_MONTHLY", "price_1T1wmmAoUwXHg17SsdSLrt6Q"): {"tier": "team", "limit": 999999},
}

class PaymentService:
    def create_checkout_session(self, user: User, price_id: str):
        """
        Creates a Stripe Checkout Session for a subscription.
        """
        try:
            # Check if user already has a customer ID
            customer_id = user.stripe_customer_id
            
            checkout_session_kwargs = {
                "payment_method_types": ["card"],
                "line_items": [{"price": price_id, "quantity": 1}],
                "mode": "subscription",
                "success_url": f"{FRONTEND_URL}/billing?success=true&session_id={{CHECKOUT_SESSION_ID}}",
                "cancel_url": f"{FRONTEND_URL}/pricing?canceled=true",
                "client_reference_id": str(user.id),
                "metadata": {"user_id": str(user.id)}
            }
            
            if customer_id:
                checkout_session_kwargs["customer"] = customer_id
            else:
                checkout_session_kwargs["customer_email"] = user.email
                
            checkout_session = stripe.checkout.Session.create(**checkout_session_kwargs)
            return {"checkout_url": checkout_session.url}
            
        except Exception as e:
            print(f"Stripe Checkout Error: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))

    def create_customer_portal_session(self, user: User):
        """
        Creates a billing portal session for managing subscriptions.
        """
        if not user.stripe_customer_id:
             raise HTTPException(status_code=400, detail="No billing account found.")
             
        try:
            portal_session = stripe.billing_portal.Session.create(
                customer=user.stripe_customer_id,
                return_url=f"{FRONTEND_URL}/billing"
            )
            return {"portal_url": portal_session.url}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def handle_webhook(self, request: Request, db: Session):
        """
        Handles Stripe webhooks to update user subscription status.
        """
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            raise HTTPException(status_code=400, detail="Invalid signature")

        # Handle Events
        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            self._handle_checkout_completed(session, db)
            
        elif event["type"] == "customer.subscription.updated":
            subscription = event["data"]["object"]
            self._handle_subscription_updated(subscription, db)
            
        elif event["type"] == "customer.subscription.deleted":
            subscription = event["data"]["object"]
            self._handle_subscription_deleted(subscription, db)

        return {"status": "success"}

    def _handle_checkout_completed(self, session, db: Session):
        user_id = session.get("client_reference_id")
        customer_id = session.get("customer")
        subscription_id = session.get("subscription")
        
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.stripe_customer_id = customer_id
                user.stripe_subscription_id = subscription_id
                db.commit()

    def _handle_subscription_updated(self, subscription, db: Session):
        customer_id = subscription.get("customer")
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        
        if user:
            # Check price ID to determine tier
            price_id = subscription["items"]["data"][0]["price"]["id"]
            
            # Default to free if price not known (or map unknown prices to free/pro)
            plan_info = filter_plan_by_price(price_id)
            
            if user.usage_quota:
                user.usage_quota.plan_tier = plan_info["tier"]
                user.usage_quota.analyses_limit = plan_info["limit"]
            else:
                # Create quota if missing
                new_quota = UsageQuota(user_id=user.id, plan_tier=plan_info["tier"], analyses_limit=plan_info["limit"])
                db.add(new_quota)
                
            db.commit()

    def _handle_subscription_deleted(self, subscription, db: Session):
        customer_id = subscription.get("customer")
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        
        if user and user.usage_quota:
            # Revert to Demo
            user.usage_quota.plan_tier = "demo"
            user.usage_quota.analyses_limit = 3
            user.stripe_subscription_id = None
            db.commit()

def filter_plan_by_price(price_id):
    # Search in environment variable configured prices
    # For now, hardcoding mapping logic helper
    for pid, info in PLAN_PRICES.items():
        if pid == price_id:
            return info
            
    # Fallback/Default based on price IDs in env (if known)
    if price_id == os.getenv("STRIPE_PRICE_PRO_MONTHLY"):
        return {"tier": "pro", "limit": 50}
    elif price_id == os.getenv("STRIPE_PRICE_TEAM_MONTHLY"):
        return {"tier": "team", "limit": 999999}
        
    return {"tier": "demo", "limit": 3} # Safe fallback

payment_service = PaymentService()
