from pydantic import BaseModel, EmailStr, Field

class SignUpRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    old_password: str
    new_password: str
    confirm_password: str

class GenerateTextRequest(BaseModel):
    user_id: str
    prompt_idea: str
    tone: str
    platform: str
    enrichment_cycles: int = Field(ge=1, le=15)

class SettingsRequest(BaseModel):
    user_id: str
    full_name: str
    default_tone: str
    default_platform: str
