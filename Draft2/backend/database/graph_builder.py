import networkx as nx
import math
from database.csv_loader import csv_loader
import pandas as pd

class GraphBuilder:

    def __init__(self):
        self.graph = nx.Graph()
        self.positions = {}

    def build_graph(self):

        nodes = csv_loader.get_nodes()
        edges = csv_loader.get_edges()

        self.graph.clear()
        def clean(v):
            return "" if pd.isna(v) else v

        for _, row in nodes.iterrows():
            self.graph.add_node(
                row["id"],
                name=clean(row["name"]),
                type=clean(row["type"]),
                sector=clean(row["sector"]),
                country=clean(row["country"]),
                rating=clean(row["rating"]),
                ticker=clean(row["ticker"]),
                description=clean(row["description"]),
            )

        for _, row in edges.iterrows():
            self.graph.add_edge(
                row["source"],
                row["target"],
                relationship=row["relationship"],
            )

        # Compute layout ONCE
        self.positions = nx.spring_layout(
            self.graph,
            seed=42,
            k=1.2,
            iterations=100,
        )

    def get_graph(self):
        return self.graph

    def get_positions(self):
        return self.positions


graph_builder = GraphBuilder()