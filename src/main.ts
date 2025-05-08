import "simpledotcss";
import partyMap from "./../data/parties.json";

const questions = [
  "Japan's defense capabilities should be strengthened.",
  "Japan should not hesitate to attack enemy bases if an attack from another country is expected.",
  "Pressure should take precedence over dialogue with North Korea.",
  "The <a href='https://en.wikipedia.org/wiki/Three_Non-Nuclear_Principles' target='_blank'>three non-nuclear principles</a> should be adhered to.",
  "The <a href='https://en.wikipedia.org/wiki/Relocation_of_Marine_Corps_Air_Station_Futenma' target='_blank'>relocation of the Futenma base</a> in Okinawa Prefecture to Henoko is unavoidable.",
  "Smaller government that doesn't cost money is better, even if government services, such as social welfare, get worse.",
  "Job security through public works is necessary.",
  "For the time being, the fiscal stimulus should be used to stimulate the economy, instead of holding down spending for the sake of fiscal consolidation.",
  "The consumption tax rate should be lowered, either temporarily or permanently.",
  "Taxes on people with high incomes and assets should be increased.",
  "The corporate tax rate should be raised.",
  "We should promote the acceptance of foreign workers.",
  "It is natural for privacy and individual rights to be restricted to protect public safety.",
  "The <a href='https://www3.nhk.or.jp/nhkworld/en/news/backstories/2670/' target='_blank'>release of treated water</a> from the Fukushima Daiichi Nuclear Power Plant into the ocean is unavoidable.",
  "Married couples should be allowed by law to continue to use each pre-marital surname after marriage if they wish to do so.",
  "Same-sex marriage should be recognized by law.",
  "The bill promote greater awareness among the public of LGBT people should be passed as soon as possible.",
];

type Party =
  | "Liberal Democratic Party"
  | "Komeito"
  | "Democratic Party for the People"
  | "Constitutional Democratic Party"
  | "Reiwa Shinsengumi"
  | "Social Democratic Party"
  | "Communist Party"
  | "Japan Innovation Party";

const partyIcons = {
  "Liberal Democratic Party":
    "https://upload.wikimedia.org/wikipedia/commons/e/ef/Liberal_Democratic_Party_of_Japan_logo.svg",
  Komeito:
    "https://upload.wikimedia.org/wikipedia/commons/3/38/Komeito_Logo_%28Japan%29.svg",
  "Democratic Party for the People":
    "https://upload.wikimedia.org/wikipedia/commons/3/3d/Logo_of_Democratic_Party_For_the_People.svg",
  "Constitutional Democratic Party":
    "https://upload.wikimedia.org/wikipedia/commons/8/84/%E6%96%B0%E3%83%BB%E7%AB%8B%E6%86%B2%E6%B0%91%E4%B8%BB%E5%85%9A_%E3%83%AD%E3%82%B4.svg",
  "Reiwa Shinsengumi":
    "https://upload.wikimedia.org/wikipedia/commons/b/be/Logo_Reiwa.svg",
  "Social Democratic Party":
    "https://upload.wikimedia.org/wikipedia/commons/0/07/Logo_Social_Democratic_Party.svg",
  "Communist Party":
    "https://upload.wikimedia.org/wikipedia/commons/7/72/Japanese_Communist_Party_logo.svg",
  "Japan Innovation Party":
    "https://upload.wikimedia.org/wikipedia/commons/5/5d/Japan_Innovation_Party.svg",
};

const answers = new Array<number>(questions.length);
let i = 0;

function calculateScores(answers: number[]): Array<[string, number]> {
  const scores = new Array();
  let max = 0;

  for (const [party, averages] of Object.entries(partyMap)) {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      score += Math.pow(averages[i] - answers[i], 2);
    }
    score = Math.sqrt(score);

    if (score > max) max = score;
    scores.push([party, score]);
  }

  for (let i = 0; i < scores.length; i++) {
    scores[i][1] = 100 - (scores[i][1] / max) * 100;
  }

  return scores.sort((a, b) => b[1] - a[1]);
}

function updateQuestion() {
  document.getElementById("heading")!.textContent = `Question ${i + 1}`;
  document.getElementById("question")!.innerHTML = questions[i];
}

function showResults() {
  document.getElementById("questions-page")!.style.display = "none";

  const resultsPage = document.getElementById("results-page")!;
  resultsPage.style.display = "flex";

  const results = calculateScores(answers);
  const table = document.getElementById("table")! as HTMLTableSectionElement;

  for (const [party, score] of results) {
    const row = table.insertRow();
    const label = row.insertCell();
    label.innerText = party;
    const data = row.insertCell();
    data.innerText = score.toFixed(0).toString();
  }
  const bestParty = results[0][0] as Party;
  const image = document.getElementById("party-icon") as HTMLImageElement;
  image.setAttribute("src", partyIcons[bestParty]);

  if (bestParty === "Komeito" || bestParty == "Reiwa Shinsengumi") {
    document.getElementById(
      "best-party"
    )!.innerText = `Your closest party is ${results[0][0]}`;
  } else {
    document.getElementById(
      "best-party"
    )!.innerText = `Your closest party is the ${results[0][0]}`;
  }
}

function reset() {
  i = 0;
  answers.fill(0);
  document.getElementById("questions-page")!.style.display = "block";
  document.getElementById("results-page")!.style.display = "none";
  document.getElementById("table")!.innerHTML = "";
  updateQuestion();
}

function goBack() {
  if (i == 0) {
    reset();
    return;
  }

  i--;
  document.getElementById("questions-page")!.style.display = "block";
  document.getElementById("results-page")!.style.display = "none";
  document.getElementById("table")!.innerHTML = "";
  updateQuestion();
}

document.getElementById("answer")!.addEventListener("click", (event) => {
  const clickedButton = event.target as HTMLButtonElement;
  if (clickedButton.id == "back") {
    goBack();
    return;
  }

  if (clickedButton.dataset.value) {
    answers[i] = Number(clickedButton.dataset.value);
    i++;
    if (i < questions.length) {
      updateQuestion();
    } else {
      showResults();
    }
  }
});

document.getElementById("reset")!.addEventListener("click", reset);

reset();
