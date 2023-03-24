const fs = require("fs");
const csv = require("csv");

const main = async () => {
  const data = await readData("data.csv");
  fs.writeFileSync("data.js", JSON.stringify(data));
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

main();
