import os
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = os.getenv("PROJECT_ID","hack-team-irds-team-1")
LOCATION = os.getenv("LOCATION", "europe-west2")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
API_PREFIX = "/api"

FUNDING_WEIGHT = 0.65
MARKET_WEIGHT = 0.35

# Funding Score

DEBT_WEIGHT = 0.35
LIQUIDITY_WEIGHT = 0.25
RATING_WEIGHT = 0.20
CONCENTRATION_WEIGHT = 0.20

# Market Score

SPREAD_WEIGHT = 0.40
TREND_WEIGHT = 0.30
VOLATILITY_WEIGHT = 0.30