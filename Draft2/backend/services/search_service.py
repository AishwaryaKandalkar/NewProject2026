from database.graph_builder import graph_builder


class SearchService:

    def __init__(self):
        self.graph = graph_builder.get_graph()

    def search(self, query):

        query = query.lower()

        results = []

        for node_id, attrs in self.graph.nodes(data=True):

            if query in attrs["name"].lower():

                results.append({
                    "id": node_id,
                    **attrs
                })

        return results

    def filter_by_type(self, node_type):

        return [
            {
                "id": node_id,
                **attrs
            }
            for node_id, attrs in self.graph.nodes(data=True)
            if attrs["type"] == node_type
        ]

    def filter_by_sector(self, sector):

        return [
            {
                "id": node_id,
                **attrs
            }
            for node_id, attrs in self.graph.nodes(data=True)
            if attrs["sector"] == sector
        ]


search_service = SearchService()