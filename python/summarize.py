import pandas as pd
from pathlib import Path
import json

if __name__ == '__main__':
    path = Path.cwd() / "data"
    df = pd.read_csv(path / "2021UTASP20211126_excludedQ11.csv", encoding="cp932")

    questions = [col for col in df.columns if col.startswith("Q6_")]
    df[questions] = df[questions].replace(99, pd.NA)

    party_map = {
        1: "Liberal Democratic Party",
        2: "Constitutional Democratic Party",
        3: "Komeito",
        4: "Communist Party",
        5: "Japan Innovation Party",
        6: "Democratic Party for the People",
        7: "Social Democratic Party",
        9: "Reiwa Shinsengumi"
    }

    df["party"] = df["PARTY"].map(party_map)

    with open(path / "parties.json", "w") as f:
        result = df[questions + ["party"]].groupby("party").mean().T.to_dict(orient="list")
        json.dump(result, f)