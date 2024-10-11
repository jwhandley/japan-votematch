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

const answers = new Array<number>(questions.length);
let i = 0;

function calculateScores(answers: number[]): Array<[string, number]> {
  const scores = new Array();
  for (const [party, averages] of Object.entries(partyMap)) {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      score += Math.pow(averages[i] - answers[i], 2);
    }
    score = Math.sqrt(score);
    scores.push([party, score]);
  }

  return scores.sort((a, b) => a[1] - b[1]);
}

function updateQuestion() {
  document.getElementById("heading")!.textContent = `Question ${i + 1}`;
  document.getElementById("question")!.innerHTML = questions[i];
}

function showResults() {
  document.getElementById("questions-page")!.style.display = "none";

  const resultsPage = document.getElementById("results-page")!;
  resultsPage.style.display = "block";

  const results = calculateScores(answers);
  const table = document.getElementById("table")! as HTMLTableSectionElement;

  for (const [party, score] of results) {
    const row = table.insertRow();
    const label = row.insertCell();
    label.innerText = party;
    const data = row.insertCell();
    data.innerText = score.toFixed(1).toString();
  }

  document.getElementById(
    "best-party"
  )!.innerText = `Your closest party is the ${results[0][0]}`;
}

function reset() {
  i = 0;
  answers.fill(0);
  document.getElementById("questions-page")!.style.display = "block";
  document.getElementById("results-page")!.style.display = "none";
  updateQuestion();
}

document.getElementById("answer")!.addEventListener("click", (event) => {
  const clickedButton = event.target as HTMLButtonElement;
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
