function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// https://stackoverflow.com/questions/29605672/how-to-generate-short-unique-names-for-uploaded-files-in-nodejs/29606462
function getRandomFileName() {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  const random = ("" + Math.random()).substring(2, 8);
  const random_number = timestamp + random;
  return random_number;
}

module.exports = {
  randomIntFromInterval,
  getRandomFileName,
};
