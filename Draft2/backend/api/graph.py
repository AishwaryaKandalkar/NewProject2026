from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.graph_service import graph_service
from services.shortest_path_service import shortest_path_service
from services.diagnostics_service import diagnostics_service

router = APIRouter(prefix="/graph", tags=["Relationship Graph"])


class PathRequest(BaseModel):
    source: str
    target: str


@router.get("")
def get_graph():
    """
    Returns all nodes and edges.
    """
    return graph_service.get_graph()


@router.get("/node/{node_id}")
def get_node(node_id: str):

    node = graph_service.get_node(node_id)

    if node is None:
        raise HTTPException(status_code=404, detail="Node not found")

    return node


@router.get("/node/{node_id}/neighbors")
def get_neighbors(node_id: str):

    return graph_service.get_neighbors(node_id)


@router.get("/node/{node_id}/diagnostics")
def diagnostics(node_id: str):

    data = diagnostics_service.diagnostics(node_id)

    if data is None:
        raise HTTPException(status_code=404, detail="Node not found")

    return data


@router.post("/path")
def shortest_path(request: PathRequest):

    return shortest_path_service.shortest_path(
        request.source,
        request.target,
    )