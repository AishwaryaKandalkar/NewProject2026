import networkx as nx

from database.graph_builder import graph_builder


class ShortestPathService:

    def __init__(self):
        self.graph = graph_builder.get_graph()

    def shortest_path(self, source, target):

        try:

            path = nx.shortest_path(
                self.graph,
                source=source,
                target=target
            )

            return {
                "path": path,
                "length": len(path) - 1
            }

        except nx.NetworkXNoPath:

            return {
                "path": [],
                "length": 0
            }

        except nx.NodeNotFound:

            return {
                "path": [],
                "length": 0
            }


shortest_path_service = ShortestPathService()