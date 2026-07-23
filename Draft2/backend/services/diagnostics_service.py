import networkx as nx

from database.graph_builder import graph_builder


class DiagnosticsService:

    def __init__(self):
        self.graph = graph_builder.get_graph()

    def diagnostics(self, node_id):

        if node_id not in self.graph:
            return None

        return {
            "degree": self.graph.degree(node_id),
            "neighbors": len(list(self.graph.neighbors(node_id))),
            "betweenness": round(
                nx.betweenness_centrality(self.graph)[node_id],
                4
            ),
            "closeness": round(
                nx.closeness_centrality(self.graph)[node_id],
                4
            ),
        }


diagnostics_service = DiagnosticsService()