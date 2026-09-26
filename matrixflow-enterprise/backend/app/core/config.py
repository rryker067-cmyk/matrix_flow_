from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MatrixFlow Enterprise API"
    api_prefix: str = "/api/v1"
    
    database_url: str = Field(default="", validation_alias="DATABASE_URL")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()