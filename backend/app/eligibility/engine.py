from app.schemas.scheme import Scheme, EligibilityResult
from app.schemas.profile import Profile
from typing import List

def evaluate_eligibility(scheme: Scheme, profile: Profile) -> EligibilityResult:
    satisfied = []
    unsatisfied = []
    unknown = []
    missing_fields = []
    
    if not scheme.criteria:
        return EligibilityResult(
            scheme=scheme,
            status="potential_match",
            is_eligible=True,
            reason="This scheme has no specific eligibility criteria listed. You may be a potential match.",
            satisfied_criteria=["No specific criteria documented."],
            unsatisfied_criteria=[],
            unknown_criteria=[],
            missing_fields=[],
            explanation="This scheme has no specific eligibility criteria listed. You may be a potential match."
        )

    for criterion in scheme.criteria:
        field = criterion.get("field")
        operator = criterion.get("operator")
        expected_value = criterion.get("value")
        description = criterion.get("description", f"{field} {operator} {expected_value}")
        
        # Check if profile has the field
        profile_value = getattr(profile, field, None)
        if profile_value is None or str(profile_value).strip() == "":
            unknown.append(description)
            if field not in missing_fields:
                missing_fields.append(field)
            continue
            
        # Evaluate condition
        passed = False
        try:
            if operator == "==":
                if isinstance(expected_value, list):
                    passed = profile_value in expected_value
                else:
                    passed = str(profile_value).lower() == str(expected_value).lower()
            elif operator == "!=":
                passed = str(profile_value).lower() != str(expected_value).lower()
            elif operator == ">=":
                passed = float(profile_value) >= float(expected_value)
            elif operator == "<=":
                passed = float(profile_value) <= float(expected_value)
            elif operator == ">":
                passed = float(profile_value) > float(expected_value)
            elif operator == "<":
                passed = float(profile_value) < float(expected_value)
            elif operator == "in":
                # Handle cases where expected_value is a list or string
                if isinstance(expected_value, list):
                    passed = any(str(profile_value).lower() == str(v).lower() for v in expected_value)
                else:
                    passed = str(profile_value).lower() in str(expected_value).lower()
        except (ValueError, TypeError):
            # Error parsing
            unknown.append(description)
            continue
            
        if passed:
            satisfied.append(description)
        else:
            unsatisfied.append(description)
            
    # Determine overall status
    if len(unsatisfied) > 0:
        status = "does_not_match"
        is_eligible = False
        explanation = "You do not meet one or more verified criteria for this scheme."
    elif len(unknown) > 0:
        status = "insufficient_information"
        is_eligible = None
        explanation = "We need more information to verify your eligibility."
    else:
        status = "potential_match"
        is_eligible = True
        explanation = "Based on the information provided, you appear to meet the documented criteria."
        
    return EligibilityResult(
        scheme=scheme,
        status=status,
        is_eligible=is_eligible,
        reason=explanation,
        satisfied_criteria=satisfied,
        unsatisfied_criteria=unsatisfied,
        unknown_criteria=unknown,
        missing_fields=missing_fields,
        explanation=explanation
    )
