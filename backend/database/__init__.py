from motor.motor_asyncio import AsyncIOMotorClient
from config import settings 
import os

client = None
db = None

async def connect_to_mongo():
    """Establishes a connection to the MongoDB database."""
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client.echodraft
    print("Successfully connected to MongoDB.")

async def close_mongo_connection():
    """Closes the MongoDB connection."""
    global client
    if client:
        client.close()
        print("MongoDB connection closed.")

def get_database():
    """Returns the database instance."""
    return db
