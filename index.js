const fs = require("fs");
const csv = require("csv");

const main = async () => {
  const data = await read_data("data.csv");
  console.log(data);
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

main();
