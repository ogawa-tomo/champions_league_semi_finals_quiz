const fs = require("fs");
const csv = require("csv");

const main = async () => {
  const data = await read_data("data.csv");
  const seasons = data.map((d) => new Season(d));
  const answer_season = seasons[Math.floor(Math.random() * seasons.length)];
  console.log(answer_season);
  console.log(answer_season.semi_finals);
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
    return `${card1}\n${card2}`;
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

main();
