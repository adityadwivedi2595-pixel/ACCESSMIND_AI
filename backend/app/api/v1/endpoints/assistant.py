from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.scheme import Scheme as SchemeModel
from app.models.profile import Profile as ProfileModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: UUID
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    reply: str
    sources: List[str] = []

@router.post("/", response_model=ChatResponse)
def ask_assistant(request: ChatRequest, db: Session = Depends(get_db)):
    msg = request.message.strip().lower()
    session_id = str(request.session_id)
    user_profile = db.query(ProfileModel).filter(ProfileModel.session_id == session_id).first()
    schemes = db.query(SchemeModel).all()
    sources = ["AccessMind Knowledge Base"]

    # 1. Check if user is asking about specific scheme by name or category
    matched_schemes = []
    for s in schemes:
        name_lower = s.name.lower()
        cat_lower = (s.category or "").lower()
        desc_lower = (s.description or "").lower()
        if (name_lower in msg or any(word in name_lower for word in msg.split() if len(word) > 3) or
            cat_lower in msg or
            (s.name.split()[0].lower() in msg and len(s.name.split()[0]) > 2)):
            matched_schemes.append(s)

    # 2. Check for general keywords
    is_student_query = any(k in msg for k in ["student", "scholarship", "college", "school", "vidyalaxmi", "study", "education"])
    is_farmer_query = any(k in msg for k in ["farmer", "kisan", "agriculture", "crop", "land", "farming"])
    is_business_query = any(k in msg for k in ["mudra", "loan", "business", "startup", "entrepreneur", "shop"])
    is_women_query = any(k in msg for k in ["women", "girl", "beti", "daughter", "mother", "female"])
    is_document_query = any(k in msg for k in ["document", "docs", "paper", "aadhaar", "pan", "certificate", "proof"])
    is_eligibility_query = any(k in msg for k in ["eligible", "eligibility", "qualify", "criteria", "apply"])

    reply = ""

    if matched_schemes:
        s = matched_schemes[0]
        sources.append(s.name)
        reply = f"Here is information on **{s.name}** ({s.category}):\n\n"
        reply += f"• **Description:** {s.description}\n"
        if s.benefits:
            reply += f"• **Benefits:** {s.benefits}\n"
        if s.documents_required:
            reply += f"• **Required Documents:** {s.documents_required}\n"
        if s.application_procedure:
            reply += f"• **How to Apply:** {s.application_procedure}\n"
        if s.source_url:
            reply += f"• **Official Portal:** {s.source_url}\n"
        
        # Check user profile match if available
        if user_profile:
            reply += f"\n💡 *Tip: Check your instant eligibility score for this scheme on the Schemes page!*"

    elif is_farmer_query:
        kisan_schemes = [s for s in schemes if s.category == "Agriculture" or "kisan" in s.name.lower()]
        reply = "For farmers and agriculture, the primary scheme available is **PM KISAN Samman Nidhi**.\n\n"
        reply += "• **Benefits:** ₹6,000 per year in three direct cash installments.\n"
        reply += "• **Documents Needed:** Aadhaar Card, Land Ownership Records, Bank Account Details.\n"
        reply += "• **Application:** Apply online at https://pmkisan.gov.in or visit your nearest CSC center."
        sources.append("PM KISAN")

    elif is_student_query:
        edu_schemes = [s for s in schemes if s.category == "Education" or "scholarship" in s.name.lower()]
        scheme_names = ", ".join([s.name for s in edu_schemes])
        reply = f"We have education and scholarship schemes available: **{scheme_names}**.\n\n"
        reply += "• **PM Vidyalaxmi Scheme:** Collateral-free education loans with interest subvention for families with income up to ₹8 Lakhs.\n"
        reply += "• **National Scholarship Portal (Post Matric):** Maintenance allowances and fee reimbursements for post-secondary students.\n\n"
        reply += "👉 Go to the **Profile** tab to ensure your *Student Status*, *Education Level*, and *Income* are filled in to verify your exact eligibility!"
        sources.append("Education Portal")

    elif is_business_query:
        reply = "For small businesses, micro-enterprises, and entrepreneurs, check out the **Pradhan Mantri Mudra Yojana (PMMY)**:\n\n"
        reply += "• **Shishu:** Loans up to ₹50,000 for new ventures.\n"
        reply += "• **Kishore:** Loans from ₹50,000 up to ₹5 Lakhs.\n"
        reply += "• **Tarun:** Loans from ₹5 Lakhs up to ₹10 Lakhs.\n"
        reply += "• **Requirements:** Age 18+, business plan, identity and address proofs. No collateral required!"
        sources.append("PMMY")

    elif is_women_query:
        reply = "For women and girl children, **Beti Bachao Beti Padhao** and related welfare initiatives provide education and financial incentives.\n\n"
        reply += "• **Eligibility:** Accounts can be opened for girl children below 10 years of age.\n"
        reply += "• **Documents Required:** Child's Birth Certificate and parents' Aadhaar card.\n"
        reply += "• **Application:** Available through Anganwadi centers and government post offices / banks."
        sources.append("WCD Schemes")

    elif is_document_query:
        reply = "Most government welfare schemes typically require the following core documents:\n\n"
        reply += "1. **Identity & Address Proof:** Aadhaar Card, Voter ID, PAN Card\n"
        reply += "2. **Financial Proof:** Income Certificate issued by Revenue Authority / Tehsildar\n"
        reply += "3. **Banking:** Active bank account linked with Aadhaar (for DBT transfers)\n"
        reply += "4. **Category / Specific Proof:** Caste Certificate (SC/ST/OBC), Land Records (for farmers), or Admission Letter (for students)\n\n"
        reply += "You can review specific required documents for each scheme in the **Schemes** tab."

    elif is_eligibility_query:
        reply = "To check your eligibility instantly:\n\n"
        reply += "1. Open the **Profile** tab and enter your age, income, state, education level, student status, and occupation.\n"
        reply += "2. Navigate to **Schemes** and click **Check Eligibility** on any scheme.\n"
        reply += "3. Our rules engine will compare your profile against the scheme criteria and provide an instant verified match status!"

    else:
        scheme_count = len(schemes)
        reply = f"Hello! I am your AccessMind AI Assistant. I have information on {scheme_count} official government schemes including education loans, scholarships, farmer support, and business mudra loans.\n\n"
        reply += "You can ask me questions like:\n"
        reply += "• *'What schemes are available for students?'*\n"
        reply += "• *'Tell me about PM KISAN Samman Nidhi'* \n"
        reply += "• *'How do I apply for Mudra loan?'*\n"
        reply += "• *'What documents do I need for scholarships?'*"

    return ChatResponse(reply=reply, sources=sources)
