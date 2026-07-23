import random
from pathlib import Path

import pandas as pd

# -----------------------------------
# Configuration
# -----------------------------------

NUM_BANKERS = 15
NUM_INVESTORS = 15

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

# -----------------------------------
# Static Data
# -----------------------------------

ISSUERS = [
    ("Airbus SE", "Aerospace", "France", "A", "AIR"),
    ("Siemens AG", "Industrials", "Germany", "A", "SIE"),
    ("BP PLC", "Energy", "United Kingdom", "BBB", "BP"),
    ("Shell PLC", "Energy", "United Kingdom", "AA", "SHEL"),
    ("Volkswagen AG", "Automotive", "Germany", "BBB", "VOW"),
    ("BMW AG", "Automotive", "Germany", "A", "BMW"),
    ("Mercedes-Benz Group", "Automotive", "Germany", "A", "MBG"),
    ("Nestlé SA", "Consumer", "Switzerland", "AA", "NESN"),
    ("Unilever PLC", "Consumer", "United Kingdom", "A", "ULVR"),
    ("Novartis AG", "Healthcare", "Switzerland", "AA", "NOVN"),
    ("Roche Holding", "Healthcare", "Switzerland", "AA", "ROG"),
    ("Enel SpA", "Utilities", "Italy", "BBB", "ENEL"),
    ("Iberdrola", "Utilities", "Spain", "A", "IBE"),
    ("TotalEnergies", "Energy", "France", "A", "TTE"),
    ("Safran SA", "Aerospace", "France", "A", "SAF"),
    ("Thales Group", "Defense", "France", "A", "HO"),
    ("Rio Tinto", "Mining", "United Kingdom", "A", "RIO"),
    ("Glencore", "Mining", "Switzerland", "BBB", "GLEN"),
    ("ING Group", "Financials", "Netherlands", "A", "ING"),
    ("Santander", "Financials", "Spain", "A", "SAN"),
    ("Deutsche Telekom", "Telecom", "Germany", "A", "DTE"),
    ("Vodafone", "Telecom", "United Kingdom", "BBB", "VOD"),
    ("L'Oréal", "Consumer", "France", "AA", "OR"),
    ("ASML Holding", "Technology", "Netherlands", "AA", "ASML"),
    ("SAP SE", "Technology", "Germany", "AA", "SAP"),
]

BANKERS = [
    "Sven de Jong",
    "James Robertson",
    "Sarah Klein",
    "Michael Bauer",
    "Emma Wilson",
    "David Clark",
    "Sophie Martin",
    "Thomas Weber",
    "Julia Fischer",
    "Daniel Moore",
    "Anna Schmidt",
    "Chris Evans",
    "Oliver King",
    "Laura White",
    "Peter Scott",
]

INVESTORS = [
    "Allianz Global Investors",
    "BlackRock",
    "Amundi",
    "PIMCO",
    "Legal & General",
    "Vanguard",
    "AXA Investment Managers",
    "Schroders",
    "Fidelity",
    "State Street",
    "Invesco",
    "Capital Group",
    "JPM Asset Management",
    "UBS Asset Management",
    "BNP Paribas Asset Management",
]

DEAL_TYPES = [
    "Green Bond",
    "Sustainability Bond",
    "Senior Notes",
    "Eurobond",
    "Convertible Bond",
]

# -----------------------------------
# Build Nodes
# -----------------------------------

nodes = []
edges = []

issuer_ids = []

for idx, issuer in enumerate(ISSUERS, start=1):
    issuer_id = f"ISS{idx:03d}"
    issuer_ids.append(issuer_id)

    nodes.append({
        "id": issuer_id,
        "name": issuer[0],
        "type": "issuer",
        "sector": issuer[1],
        "country": issuer[2],
        "rating": issuer[3],
        "ticker": issuer[4],
        "description": issuer[0]
    })

# -----------------------------------
# Banker Nodes
# -----------------------------------

banker_ids = []

for idx, banker in enumerate(BANKERS, start=1):
    banker_id = f"BNK{idx:03d}"
    banker_ids.append(banker_id)

    nodes.append({
        "id": banker_id,
        "name": banker,
        "type": "banker",
        "sector": "",
        "country": "",
        "rating": "",
        "ticker": "",
        "description": "Investment Banker"
    })

# -----------------------------------
# Investor Nodes
# -----------------------------------

investor_ids = []

for idx, investor in enumerate(INVESTORS, start=1):
    investor_id = f"INV{idx:03d}"
    investor_ids.append(investor_id)

    nodes.append({
        "id": investor_id,
        "name": investor,
        "type": "investor",
        "sector": "",
        "country": "",
        "rating": "",
        "ticker": "",
        "description": "Institutional Investor"
    })

# -----------------------------------
# Deal Nodes
# -----------------------------------

deal_ids = []

deal_counter = 1

for issuer_id, issuer in zip(issuer_ids, ISSUERS):

    num_deals = random.randint(1, 2)

    for _ in range(num_deals):

        deal_id = f"DL{deal_counter:03d}"

        deal_counter += 1

        deal_name = (
            f"{issuer[0]} "
            f"{random.choice(DEAL_TYPES)} "
            f"{random.randint(2027,2032)}"
        )

        deal_ids.append(deal_id)

        nodes.append({
            "id": deal_id,
            "name": deal_name,
            "type": "deal",
            "sector": "",
            "country": "",
            "rating": "",
            "ticker": "",
            "description": "Debt Capital Market Deal"
        })

        # Issued
        edges.append({
            "source": issuer_id,
            "target": deal_id,
            "relationship": "ISSUED"
        })

        # Arranged By
        banker = random.choice(banker_ids)

        edges.append({
            "source": deal_id,
            "target": banker,
            "relationship": "ARRANGED_BY"
        })

        # Purchased by 2-4 Investors
        investors = random.sample(
            investor_ids,
            random.randint(2,4)
        )

        for inv in investors:

            edges.append({
                "source": deal_id,
                "target": inv,
                "relationship": "PURCHASED_BY"
            })

# -----------------------------------
# Coverage Relationships
# -----------------------------------

for issuer in issuer_ids:

    banker = random.choice(banker_ids)

    edges.append({
        "source": banker,
        "target": issuer,
        "relationship": "COVERS"
    })

# -----------------------------------
# Peer Relationships
# -----------------------------------

for i in range(len(issuer_ids)):

    issuer = issuer_ids[i]

    others = issuer_ids[:i] + issuer_ids[i+1:]

    peers = random.sample(others, 2)

    for peer in peers:

        edges.append({
            "source": issuer,
            "target": peer,
            "relationship": "PEER"
        })

# -----------------------------------
# Save CSV
# -----------------------------------

pd.DataFrame(nodes).to_csv(
    DATA_DIR / "nodes.csv",
    index=False
)

pd.DataFrame(edges).to_csv(
    DATA_DIR / "edges.csv",
    index=False
)

print("=================================")
print("Relationship Graph Generated")
print("=================================")
print(f"Nodes : {len(nodes)}")
print(f"Edges : {len(edges)}")
print(f"Saved to {DATA_DIR}")