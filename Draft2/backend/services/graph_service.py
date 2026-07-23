from database.graph_builder import graph_builder
from utils.graph_mapper import (
    map_nodes,
    map_edges,
)

class GraphService:

    def __init__(self):
        self.graph = graph_builder.get_graph()


    def get_graph(self):

        return {
            "nodes": map_nodes(self.graph),
            "edges": map_edges(self.graph)
        }

    def get_node(self, node_id):

        if node_id not in self.graph:
            return None

        attrs = self.graph.nodes[node_id]

        return {
            "id": node_id,
            **attrs
        }

    def get_neighbors(self, node_id):

        if node_id not in self.graph:
            return []

        neighbors = []

        for neighbor in self.graph.neighbors(node_id):

            neighbors.append({
                "id": neighbor,
                **self.graph.nodes[neighbor]
            })

        return neighbors


graph_service = GraphService()