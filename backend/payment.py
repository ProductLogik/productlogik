from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import get_current_user
from services.payment_service import payment_service

router = APIRouter()

@router.post("/checkout")
async def create_checkout(
    request: Request, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Create a Stripe Checkout Session for upgrading plans.
    Expects JSON: { "priceId": "price_..." }
    """
    data = await request.json()
    price_id = data.get("priceId")
    
    if not price_id:
        raise HTTPException(status_code=400, detail="Missing priceId")
        
    return payment_service.create_checkout_session(current_user, price_id)

@router.post("/portal")
async def create_portal(
    current_user: User = Depends(get_current_user)
):
    """
    Create a Stripe Customer Portal session for managing billing.
    """
    return payment_service.create_customer_portal_session(current_user)

@router.post("/webhook")
async def webhook(
    request: Request, 
    db: Session = Depends(get_db)
):
    """
    Stripe Webhook Handler.
    """
    return await payment_service.handle_webhook(request, db)
