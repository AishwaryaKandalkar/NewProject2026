from typing import Dict, List
from database.graph_builder import graph_builder
import networkx as nx
import math
import pandas as pd

def clean(v):
    return "" if pd.isna(v) else v
NODE_COLORS = {
    "issuer": "#2563eb",
    "banker": "#16a34a",
    "investor": "#ea580c",
    "deal": "#9333ea",
}

print("map_nodes() called")
def map_nodes(graph):

    positions = graph_builder.get_positions()

    nodes = []

    for node_id, attrs in graph.nodes(data=True):

        x, y = positions[node_id]

    
        nodes.append({
            "id": node_id,
            "label": clean(attrs["name"]),
            "type": clean(attrs["type"]),
            "x": float(x * 1200),
            "y": float(y * 800),
            "sector": clean(attrs["sector"]),
            "country": clean(attrs["country"]),
            "rating": clean(attrs["rating"]),
            "ticker": clean(attrs["ticker"]),
            "description": clean(attrs["description"]),
        })
    return nodes


def map_edges(graph) -> List[Dict]:
    react_edges = []

    for source, target, attrs in graph.edges(data=True):

        react_edges.append({
            "id": f"{source}-{target}",
            "source": source,
            "target": target,
            "label": attrs["relationship"]
        })

    return react_edges