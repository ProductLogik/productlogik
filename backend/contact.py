from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


@router.post("/contact")
async def submit_contact(request: ContactRequest):
    from services.email_service import email_service

    sent = email_service.send_contact_email(
        name=request.name,
        email=request.email,
        message=request.message
    )

    if not sent:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Email service is currently unavailable. Please try again later."
        )

    return {"status": "success", "message": "Message sent securely"}
