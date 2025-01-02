from samplescape import db
from fastapi import FastAPI, Query,  Request
from fastapi.middleware.cors import CORSMiddleware


__version__ = "0.1.0"


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def get_root(request: Request):
    return {
        "app": "samplescape", 
        "version": __version__,
        "root_path": request.scope.get("root_path")
    }


@app.get("/studies")
def get_studies(
    search: str | None = Query(default=None),
    programme: list[str] = Query(default=None),
    sponsor: list[str] = Query(default=None),
    release_strategy: list[str] = Query(default=None),
):
    studies = db.get_studies(
        search=search,
        programme=programme,
        sponsor=sponsor,
        release_strategy=release_strategy,
    )
    return {
        "meta": {
            "filter": {
                "programme": programme,
                "sponsor": sponsor,
                "release_strategy": release_strategy,
            },
            "total": len(studies),
        },
        "studies": studies,
    }


@app.get("/studies/sponsors")
def get_sponsors():
    return sorted([x["faculty_sponsor"] for x in db.get_sponsors()])


@app.get("/studies/programmes")
def get_programmes():
    return sorted([x["programme"] for x in db.get_programmes()])


@app.get("/studies/release_strategy")
def get_release_strategies():
    return sorted([x["data_release_strategy"] for x in db.get_release_strategies()])


@app.get("/studies/{study_id}")
def get_study(study_id: int):
    studies = db.get_studies(study_id)
    return studies[0]


@app.get("/studies/{study_id}/samples")
def get_samples(study_id: int):
    samples = db.get_samples(study_id=study_id)
    return {
        "meta": {"total": len(samples), "study_id": study_id},
        "samples": samples,
    }


@app.get("/samples")
def get_samples(study_id: int = Query(default=None), search: str = Query(default=None)):
    samples = db.get_samples(search=search, study_id=study_id)
    return {
        "meta": {"total": len(samples), "search": search, "study_id": study_id},
        "samples": samples,
    }


@app.get("/samples/{sample_id}")
def get_sample(
    sample_id: int,
):
    # sample_id is id_sample_tmp because MLWH indexes
    # don't seem to work for (id_lims + id_sample_lims)
    return db.get_sample(sample_id=sample_id)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=80)
