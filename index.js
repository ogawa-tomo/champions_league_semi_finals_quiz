#!/usr/bin/env node
const fs = require("fs");
const csv = require("csv");
const { Select } = require("enquirer");

const main = async () => {
  const data = await readData("/data.csv");
  const seasons = data.map((d) => new Season(d));
  const seasonsManager = new SeasonsManager(seasons);

  let score = 0;
  console.log(
    "\x1b[1mChoose the correct UEFA Champions League / European Cup semi-finals for the given season."
  );
  for (let i = 1; i <= 10; i++) {
    const answerSeason = seasonsManager.getAnswerSeason();
    const choices = seasonsManager.getChoices(answerSeason);
    const answer = await selectAnswerFromChoice(
      choices,
      `\x1b[1m[${i}/10] ${answerSeason.season}`
    );
    if (answer === answerSeason.semiFinals) {
      console.log("\x1b[1m\x1b[32mCorrect!");
      score++;
    } else {
      console.log("\x1b[1m\x1b[31mIncorrect! \x1b[0mThe answer is:");
      console.log(answerSeason.semiFinals);
    }
  }
  console.log(`\x1b[39m\x1b[1mFinish! Your score is ${score}/10.`);
};

const readData = (file) => {
  return new Promise((resolve) => {
    fs.createReadStream(file).pipe(
      csv.parse({ columns: true }, function (err, data) {
        resolve(data);
      })
    );
  });
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const selectAnswerFromChoice = async (choices, message) => {
  const prompt = new Select({
    name: "choices",
    message: message,
    choices: choices.map((choice) => choice.semiFinals),
  });
  return await prompt.run();
};

class Season {
  constructor(seasonData) {
    this._season = seasonData.season;
    this._winner = seasonData.winner;
    this._runnersUp = seasonData.runnersUp;
    this._semiFinal1_1 = seasonData.semiFinal1_1;
    this._semiFinal1_2 = seasonData.semiFinal1_2;
    this._semiFinal2_1 = seasonData.semiFinal2_1;
    this._semiFinal2_2 = seasonData.semiFinal2_2;
  }

  get semiFinals() {
    const card1 = `${this._semiFinal1_1} v ${this._semiFinal1_2}`;
    const card2 = `${this._semiFinal2_1} v ${this._semiFinal2_2}`;
    return `${card1} / ${card2}`;
  }

  get season() {
    return this._season;
  }

  get winner() {
    return this._winner;
  }

  get runnersUp() {
    return this._runnersUp;
  }
}

class SeasonsManager {
  constructor(seasons) {
    this._seasons = seasons;
    this._seasonsForAnswer = seasons.map((season) => season);
  }

  getAnswerSeason() {
    const idx = Math.floor(Math.random() * this._seasonsForAnswer.length);
    const answerSeason = this._seasonsForAnswer.splice(idx, 1)[0];
    return answerSeason;
  }

  getChoices(answerSeason) {
    const answerIndex = this._seasons.indexOf(answerSeason);

    // 正解の前後10年をダミー選択肢の候補とする
    let dummySeasonCandidate1 = this._seasons.slice(
      Math.max(0, answerIndex - 10),
      answerIndex
    );
    let dummySeasonCandidate2 = this._seasons.slice(
      answerIndex + 1,
      Math.min(answerIndex + 11, this._seasons.length)
    );
    let dummySeasonCandidate = dummySeasonCandidate1.concat(
      dummySeasonCandidate2
    );

    let choices = [answerSeason];
    for (let i = 0; i < 3; i++) {
      let idx = Math.floor(Math.random() * dummySeasonCandidate.length);
      let season = dummySeasonCandidate.splice(idx, 1)[0];
      choices.push(season);
    }

    shuffle(choices);

    return choices;
  }
}

main();
