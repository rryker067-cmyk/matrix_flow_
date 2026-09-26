from pydantic import BaseModel


class UserSummary(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str