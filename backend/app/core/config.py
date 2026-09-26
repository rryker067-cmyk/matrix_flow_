from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "MatrixFlow Enterprise API"
    api_prefix: str = "/api/v1"
    database_url: str = Field(default="", validation_alias="DATABASE_URL")
    jwt_secret_key: str = Field(default="", validation_alias="JWT_SECRET_KEY")
    jwt_expire_minutes: int = Field(default=480, validation_alias="JWT_EXPIRE_MINUTES")
    cors_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173"],
        validation_alias="CORS_ORIGINS",
    )

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()