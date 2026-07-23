from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


class CSVLoader:
    """
    Loads all CSV files once and caches them.
    """

    def __init__(self):
        self.nodes = None
        self.edges = None

    def load(self):
        self.nodes = pd.read_csv(DATA_DIR / "nodes.csv")
        self.edges = pd.read_csv(DATA_DIR / "edges.csv")

    def get_nodes(self):
        return self.nodes

    def get_edges(self):
        return self.edges


# Singleton
csv_loader = CSVLoader()