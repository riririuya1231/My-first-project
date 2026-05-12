const examRows = [
  { ielts: "9", oldToefl: "118–120", newToefl: "6", cet4: "680–710", cet6: "660–710", gaokaoEnglish: "143–150", postgradEnglish: "95–100" },
  { ielts: "8.5", oldToefl: "115–117", newToefl: "6", cet4: "666–679", cet6: "646–659", gaokaoEnglish: "139–142", postgradEnglish: "90–94" },
  { ielts: "8", oldToefl: "110–114", newToefl: "5.5", cet4: "650–665", cet6: "630–645", gaokaoEnglish: "135–138", postgradEnglish: "85–89" },
  { ielts: "7.5", oldToefl: "102–109", newToefl: "5.5", cet4: "636–649", cet6: "605–629", gaokaoEnglish: "130–134", postgradEnglish: "80–84" },
  { ielts: "7", oldToefl: "94–101", newToefl: "5", cet4: "620–635", cet6: "580–604", gaokaoEnglish: "125–129", postgradEnglish: "75–79" },
  { ielts: "6.5", oldToefl: "87–93", newToefl: "4.5", cet4: "597–619", cet6: "556–579", gaokaoEnglish: "120–124", postgradEnglish: "70–74" },
  { ielts: "6", oldToefl: "79–86", newToefl: "4", cet4: "574–596", cet6: "528–555", gaokaoEnglish: "110–119", postgradEnglish: "65–69" },
  { ielts: "5.5", oldToefl: "60–78", newToefl: "3.5", cet4: "550–573", cet6: "500–527", gaokaoEnglish: "100–109", postgradEnglish: "60–64" },
  { ielts: "5", oldToefl: "46–59", newToefl: "3", cet4: "488–549", cet6: "451–499", gaokaoEnglish: "90–99", postgradEnglish: "55–59", highlight: true },
  { ielts: "4.5", oldToefl: "35–45", newToefl: "2.5", cet4: "420–487", cet6: "401–450", gaokaoEnglish: "80–89", postgradEnglish: "50–54" },
  { ielts: "4", oldToefl: "32–34", newToefl: "2", cet4: "211–420", cet6: "201–400", gaokaoEnglish: "60–79", postgradEnglish: "40–49" },
  { ielts: "0–3.5", oldToefl: "0–31", newToefl: "1.0–1.5", cet4: "0–210", cet6: "0–200", gaokaoEnglish: "0–59", postgradEnglish: "0–39" },
];

const placementRows = [
  { score: "≤20", ielts: "≤4.0" },
  { score: "21–26", ielts: "4.5" },
  { score: "27–37", ielts: "5.0", highlight: true },
  { score: "38–43", ielts: "5.5", highlight: true },
  { score: "44–54", ielts: "6.0" },
  { score: "55–60", ielts: "≥6.5" },
];

const examLabels = {
  ielts: "雅思",
  oldToefl: "老托福",
  newToefl: "新托福",
  cet4: "英语四级 CET-4",
  cet6: "英语六级 CET-6",
  gaokaoEnglish: "高考英语",
  postgradEnglish: "考研英语",
};

const examTableBody = document.querySelector("#examTable tbody");
const placementTableBody = document.querySelector("#placementTable tbody");
const examResult = document.querySelector("#examResult");
const placementResult = document.querySelector("#placementResult");

function parseRange(rangeText) {
  if (rangeText.startsWith("≤")) {
    return { min: Number.NEGATIVE_INFINITY, max: Number(rangeText.slice(1)) };
  }

  if (rangeText.startsWith("≥")) {
    return { min: Number(rangeText.slice(1)), max: Number.POSITIVE_INFINITY };
  }

  const normalizedRange = rangeText.replace("-", "–");
  if (normalizedRange.includes("–")) {
    const [min, max] = normalizedRange.split("–").map(Number);
    return { min, max };
  }

  const exact = Number(normalizedRange);
  return { min: exact, max: exact };
}

function scoreInRange(score, rangeText) {
  const { min, max } = parseRange(rangeText);
  return score >= min && score <= max;
}

function setResult(element, html, isError = false) {
  element.innerHTML = html;
  element.classList.toggle("error", isError);
}

function buildExamResult(rows, sourceType) {
  const matchedRows = Array.isArray(rows) ? rows : [rows];
  const ieltsText = matchedRows.map((row) => row.ielts).join(" 或 ");
  const detailText = matchedRows
    .map(
      (row) =>
        `雅思 ${row.ielts}：老托福 ${row.oldToefl}｜新托福 ${row.newToefl}｜CET-4 ${row.cet4}｜CET-6 ${row.cet6}｜高考英语 ${row.gaokaoEnglish}｜考研英语 ${row.postgradEnglish}`
    )
    .join("<br />");

  return `
    <div>${examLabels[sourceType]}分数对应的雅思参考分数：<strong>${ieltsText}</strong></div>
    <div>${detailText}</div>
  `;
}

function renderExamTable() {
  examRows.forEach((row) => {
    const tr = document.createElement("tr");
    if (row.highlight) tr.classList.add("highlight");
    tr.innerHTML = `
      <td>${row.ielts}</td>
      <td>${row.oldToefl}</td>
      <td>${row.newToefl}</td>
      <td>${row.cet4}</td>
      <td>${row.cet6}</td>
      <td>${row.gaokaoEnglish}</td>
      <td>${row.postgradEnglish}</td>
    `;
    tr.addEventListener("click", () => setResult(examResult, buildExamResult(row, "ielts")));
    examTableBody.appendChild(tr);
  });
}

function renderPlacementTable() {
  placementRows.forEach((row) => {
    const tr = document.createElement("tr");
    if (row.highlight) tr.classList.add("highlight");
    tr.innerHTML = `<td>${row.score}</td><td>${row.ielts}</td>`;
    tr.addEventListener("click", () => {
      setResult(placementResult, `内部测试 <strong>${row.score}</strong> 分，对应参考雅思 <strong>${row.ielts}</strong>。`);
    });
    placementTableBody.appendChild(tr);
  });
}

function handleExamSubmit(event) {
  event.preventDefault();

  const form = new FormData(event.currentTarget);
  const examType = form.get("examType");
  const rawScore = form.get("examScore");
  const score = Number(rawScore);

  if (rawScore === "" || Number.isNaN(score)) {
    setResult(examResult, "请输入有效分数。", true);
    return;
  }

  const matchedRows = examRows.filter((row) => scoreInRange(score, row[examType]));
  if (matchedRows.length === 0) {
    setResult(examResult, `未找到 ${examLabels[examType]} ${score} 分对应的雅思换算区间，请检查分数范围。`, true);
    return;
  }

  setResult(examResult, buildExamResult(matchedRows, examType));
}

function handlePlacementSubmit(event) {
  event.preventDefault();

  const form = new FormData(event.currentTarget);
  const rawScore = form.get("placementScore");
  const score = Number(rawScore);

  if (rawScore === "" || Number.isNaN(score) || score < 0 || score > 60) {
    setResult(placementResult, "请输入 0 到 60 之间的有效内部测试分数。", true);
    return;
  }

  const matchedRow = placementRows.find((row) => scoreInRange(score, row.score));
  setResult(placementResult, `内部测试 ${score} 分，对应参考雅思 <strong>${matchedRow.ielts}</strong>。`);
}

renderExamTable();
renderPlacementTable();
document.querySelector("#examForm").addEventListener("submit", handleExamSubmit);
document.querySelector("#placementForm").addEventListener("submit", handlePlacementSubmit);
