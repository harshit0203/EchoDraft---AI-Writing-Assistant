from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Manages application settings and loads variables from the .env file.
    """
    MONGO_URI: str
    JWT_SECRET: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
