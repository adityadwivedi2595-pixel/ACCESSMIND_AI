from sqlalchemy.orm import Session
from app.db.session import engine, Base
from app.models.scheme import Scheme

Base.metadata.create_all(bind=engine)

def seed_db():
    with Session(engine) as db:
        existing_names = {name for (name,) in db.query(Scheme.name).all()}
            
        schemes_data = [
            {
                "name": "PM Vidyalaxmi Scheme",
                "category": "Education",
                "description": "Financial support to meritorious students to ensure that financial constraints do not prevent them from pursuing higher studies.",
                "benefits": "Education loan without collateral, interest subvention for students with family income up to Rs. 8 lakhs.",
                "documents_required": "Aadhaar Card, Admission Letter, Income Certificate, PAN Card.",
                "application_procedure": "Apply through the unified PM Vidyalaxmi portal.",
                "source_url": "https://www.myscheme.gov.in/",
                "last_verified": "2023-11-01",
                "criteria": [
                    {"field": "student_status", "operator": "==", "value": "Yes", "description": "Must be an enrolled student"},
                    {"field": "income", "operator": "<=", "value": 800000, "description": "Annual family income must be up to ₹8 Lakhs for interest subvention"}
                ]
            },
            {
                "name": "PM KISAN Samman Nidhi",
                "category": "Agriculture",
                "description": "Income support to all landholding farmers' families in the country.",
                "benefits": "₹6,000 per year in three equal installments.",
                "documents_required": "Aadhaar Card, Bank Account Details, Land Ownership Records.",
                "application_procedure": "Register at pmkisan.gov.in or through CSCs.",
                "source_url": "https://pmkisan.gov.in/",
                "last_verified": "2023-11-05",
                "criteria": [
                    {"field": "occupation", "operator": "==", "value": "Farmer", "description": "Must be a landholding farmer"}
                ]
            },
            {
                "name": "Pradhan Mantri Mudra Yojana (PMMY)",
                "category": "Entrepreneurship",
                "description": "Loans up to 10 lakhs to non-corporate, non-farm small/micro enterprises.",
                "benefits": "Collateral-free loans under Shishu (up to 50k), Kishore (50k-5L), and Tarun (5L-10L).",
                "documents_required": "Identity Proof, Business Plan, Address Proof.",
                "application_procedure": "Apply at any bank branch or online through Udyamimitra portal.",
                "source_url": "https://www.mudra.org.in/",
                "last_verified": "2023-10-15",
                "criteria": [
                    {"field": "age", "operator": ">=", "value": 18, "description": "Must be at least 18 years old"},
                    {"field": "employment_status", "operator": "in", "value": ["Self-employed", "Unemployed"], "description": "Intended for entrepreneurs"}
                ]
            },
            {
                "name": "Beti Bachao Beti Padhao",
                "category": "Women & Family",
                "description": "Aimed at generating awareness and improving the efficiency of welfare services intended for girls.",
                "benefits": "Various educational and financial incentives depending on the state.",
                "documents_required": "Birth Certificate, Aadhaar Card of parents.",
                "application_procedure": "Through Anganwadi centers or local government hospitals.",
                "source_url": "https://wcd.nic.in/bbbp-schemes",
                "last_verified": "2023-09-20",
                "criteria": [
                    {"field": "age", "operator": "<=", "value": 10, "description": "Girl child should be below 10 years of age for account opening"}
                ]
            },
            {
                "name": "National Scholarship Portal - Post Matric",
                "category": "Education",
                "description": "Scholarships for students studying at post matriculation or post-secondary stage.",
                "benefits": "Maintenance allowance, reimbursement of compulsory non-refundable fees.",
                "documents_required": "Previous year mark sheet, Income Certificate, Caste Certificate (if applicable), Bank Details.",
                "application_procedure": "Apply online at scholarships.gov.in",
                "source_url": "https://scholarships.gov.in/",
                "last_verified": "2023-11-01",
                "criteria": [
                    {"field": "student_status", "operator": "==", "value": "Yes", "description": "Must be an enrolled student"},
                    {"field": "education_level", "operator": "in", "value": ["High School", "Undergraduate", "Postgraduate"], "description": "Must be post-matric level"},
                    {"field": "income", "operator": "<=", "value": 250000, "description": "Annual family income threshold varies but generally below ₹2.5 Lakhs"}
                ]
            },
            {
                "name": "PM Vishwakarma",
                "category": "Entrepreneurship",
                "description": "Support for artisans and craftspeople in 18 traditional trades, including skill training, toolkit incentives, credit support, and market linkage. Age is only an initial filter; trade, family, employment, and prior-loan conditions must also be checked.",
                "benefits": "Skill training with stipend, toolkit incentive, collateral-free credit support, and market-linkage assistance as per scheme terms.",
                "documents_required": "Aadhaar, bank account details, and trade-related information; local verification and other documents may be required.",
                "application_procedure": "Register through the official PM Vishwakarma portal with assistance from a Common Service Centre.",
                "source_url": "https://pmvishwakarma.gov.in/",
                "last_verified": "2026-10-16",
                "criteria": [
                    {"field": "age", "operator": ">=", "value": 18, "description": "Initial filter only: applicant must be at least 18; one of 18 listed trades and other scheme conditions must also be verified"}
                ]
            },
            {
                "name": "Atal Pension Yojana (APY)",
                "category": "Pension & Social Security",
                "description": "Voluntary, contribution-based pension scheme. The age range is only an initial filter; a savings bank or post-office account is required, and income-tax payers are not eligible to join from 1 October 2022.",
                "benefits": "Government-guaranteed minimum monthly pension of ₹1,000 to ₹5,000 from age 60, based on the selected contribution plan and scheme conditions.",
                "documents_required": "Savings bank or post-office account details, Aadhaar, and nominee details.",
                "application_procedure": "Apply through a participating bank or post office, or use the official eAPY registration service.",
                "source_url": "https://www.pfrda.org.in/web/pfrda/schemes/atal-pension-yojana-apy",
                "last_verified": "2026-10-16",
                "criteria": [
                    {"field": "age", "operator": ">=", "value": 18, "description": "Initial filter only: joining age must be from 18 through 40; tax-payer and account conditions are not checked by this profile"}
                ]
            },
            {
                "name": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
                "category": "Insurance & Social Security",
                "description": "Renewable one-year life-insurance cover. The age range is only an initial filter; an eligible bank or post-office account, consent for auto-debit, and the current scheme terms are also required.",
                "benefits": "Life-insurance cover as per current scheme terms; confirm the current premium, coverage, and exclusions with the participating bank or official portal.",
                "documents_required": "Eligible savings bank or post-office account details and consent for auto-debit.",
                "application_procedure": "Enroll through a participating bank or post office under the official Jan Suraksha programme.",
                "source_url": "https://jansuraksha.gov.in/Forms-PMJJBY.aspx",
                "last_verified": "2026-10-16",
                "criteria": [
                    {"field": "age", "operator": ">=", "value": 18, "description": "Initial filter only: entry age begins at 18; maximum entry age and account/insurance conditions must be confirmed with the provider"}
                ]
            },
            {
                "name": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
                "category": "Insurance & Social Security",
                "description": "Renewable one-year personal-accident insurance cover. The age range is only an initial filter; an eligible bank or post-office account, consent for auto-debit, and the current scheme terms are also required.",
                "benefits": "Accident-related cover as per current scheme terms; confirm the current premium, coverage, and exclusions with the participating bank or official portal.",
                "documents_required": "Eligible savings bank or post-office account details and consent for auto-debit.",
                "application_procedure": "Enroll through a participating bank or post office under the official Jan Suraksha programme.",
                "source_url": "https://jansuraksha.gov.in/Forms-PMSBY.aspx",
                "last_verified": "2026-10-16",
                "criteria": [
                    {"field": "age", "operator": ">=", "value": 18, "description": "Initial filter only: entry age begins at 18; maximum entry age and account/insurance conditions must be confirmed with the provider"}
                ]
            }
        ]
        
        added_count = 0
        for scheme_data in schemes_data:
            if scheme_data["name"] in existing_names:
                continue
            db_scheme = Scheme(**scheme_data)
            db.add(db_scheme)
            existing_names.add(scheme_data["name"])
            added_count += 1
            
        db.commit()
        print(f"Added {added_count} schemes. Database now has {len(existing_names)}.")

if __name__ == "__main__":
    seed_db()
