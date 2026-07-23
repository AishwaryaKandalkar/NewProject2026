from fastapi import APIRouter, Query

from services.search_service import search_service

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)


@router.get("")
def search(q: str = Query(...)):

    return search_service.search(q)


@router.get("/type/{node_type}")
def filter_by_type(node_type: str):

    return search_service.filter_by_type(node_type)


@router.get("/sector/{sector}")
def filter_by_sector(sector: str):

    return search_service.filter_by_sector(sector)