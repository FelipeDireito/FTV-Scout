import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "FTV_SCOUT"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "sqlite:///./dados.db"
    )
    
    # SECRET_KEY: str = os.getenv

settings = Settings()