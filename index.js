const fs = require("fs");
const csv = require("csv");
const { Select } = require("enquirer");

const main = async () => {
  const data = await read_data("data.csv");
  const seasons = data.map((d) => new Season(d));
  let seasons_for_answer = seasons.map((season) => season);

  console.log(
    "Choose the correct semi-finals of UEFA Champions League / European Cup of the season."
  );
  for (let i = 1; i <= 10; i++) {
    const idx = Math.floor(Math.random() * seasons_for_answer.length);
    const answer_season = seasons_for_answer.splice(idx, 1)[0];
    let choices = get_choices(seasons, answer_season);
    const answer = await selectAnswerFromChoice(
      choices,
      `Q${i}: ${answer_season.season}`
    );
    if (answer === answer_season.semi_finals) {
      console.log("Correct!");
    } else {
      console.log("Incorrect! The answer is:");
      console.log(answer_season.semi_finals);
    }
  }
};

const read_data = (file) => {
  return new Promise((resolve) => {
    fs.createReadStream(file).pipe(
      csv.parse({ columns: true }, function (err, data) {
        resolve(data);
      })
    );
  });
};

const get_choices = (seasons, answer_season) => {
  const answer_index = seasons.indexOf(answer_season);

  // 正解の前後10年をダミー選択肢の候補とする
  let dummy_season_candidates1 = seasons.slice(
    Math.max(0, answer_index - 10),
    answer_index
  );
  let dummy_season_candidates2 = seasons.slice(
    answer_index + 1,
    Math.min(answer_index + 11, seasons.length)
  );
  let dummy_season_candidates = dummy_season_candidates1.concat(
    dummy_season_candidates2
  );

  let choices = [answer_season];
  for (let i = 0; i < 3; i++) {
    let idx = Math.floor(Math.random() * dummy_season_candidates.length);
    let season = dummy_season_candidates.splice(idx, 1)[0];
    choices.push(season);
  }

  shuffle(choices);

  return choices;
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
    choices: choices.map((choice) => choice.semi_finals),
  });
  return await prompt.run();
};

class Season {
  constructor(season_data) {
    this._season = season_data.season;
    this._winner = season_data.winner;
    this._runners_up = season_data.runners_up;
    this._semi_final1_1 = season_data.semi_final1_1;
    this._semi_final1_2 = season_data.semi_final1_2;
    this._semi_final2_1 = season_data.semi_final2_1;
    this._semi_final2_2 = season_data.semi_final2_2;
  }

  get semi_finals() {
    const card1 = `${this._semi_final1_1} v ${this._semi_final1_2}`;
    const card2 = `${this._semi_final2_1} v ${this._semi_final2_2}`;
    return `${card1} / ${card2}`;
  }

  get season() {
    return this._season;
  }

  get winner() {
    return this._winner;
  }

  get runners_up() {
    return this._runners_up;
  }
}

// class SeasonsManager {
//   constructor(seasons) {
//     this._seasons = seasons
//     this._seasons_for_answer =
//   }
// }

main();
