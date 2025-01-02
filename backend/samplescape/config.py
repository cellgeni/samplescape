import os
import logging
from dotenv import load_dotenv


load_dotenv()

class Settings:
    
    DB_MLWH = {
        "host": os.environ.get("MYSQL_HOST", ""),
        "database": os.environ.get("MYSQL_DATABASE", ""),
        "port": int(os.environ.get("MYSQL_PORT", "0")),
        "user": os.environ.get("MYSQL_USERNAME", ""),
        "password": os.environ.get("MYSQL_PASSWORD", ""),
        "pool_name": "MLWH",
        "pool_size": 10,
    }
    
    for k,v in DB_MLWH.items():
        if not v:
            logging.error(f"Config value missing for key {k}")

    log_level = logging.DEBUG
