from fastapi import FastAPI

from database.csv_loader import csv_loader
from database.graph_builder import graph_builder

from api.graph import router as graph_router
from api.search import router as search_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Strategic Origination Graph API",
    version="1.0"
)


@app.on_event("startup")
def startup():

    csv_loader.load()

    graph_builder.build_graph()

    print("Graph Loaded Successfully")

    G = graph_builder.get_graph()

    print(
        f"Nodes: {G.number_of_nodes()}"
    )

    print(
        f"Edges: {G.number_of_edges()}"
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(graph_router)
app.include_router(search_router)


@app.get("/")
def root():

    return {
        "status": "running"
    }