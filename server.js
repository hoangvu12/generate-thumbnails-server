const ffmpeg = require("fluent-ffmpeg");
const express = require("express");
const fs = require("fs");
const { randomIntFromInterval, getRandomFileName } = require("./utils");
const app = express();

app.use(express.json());

app.post("/generate", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.send("No url provided");
  }

  try {
    let format = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(url, function (err, metadata) {
        if (err) return reject(err);

        resolve(metadata.format);
      });
    });

    if (!format) {
      format = {
        start_time: 1.4,
        duration: 600,
      };
    }

    const { start_time, duration } = format;

    const OFFSET = 120; // 2 minutes

    const randomDuration = randomIntFromInterval(
      Math.floor(start_time) + OFFSET,
      Math.floor(duration) - OFFSET
    );

    const folder = "./images";

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    const fileName = `${getRandomFileName()}.jpg`;
    const filePath = `.${folder}/${fileName}`;

    const imageStream = await new Promise((resolve, reject) => {
      ffmpeg(url)
        .screenshot({
          timestamps: [randomDuration],
          filename: fileName,
          folder,
          size: "1280x720",
        })
        .on("end", () => {
          const stream = fs.createReadStream(filePath);

          resolve(stream);
        })
        .on("error", reject);
    });

    imageStream.pipe(res);

    fs.rmSync(filePath, { force: true });
  } catch (err) {
    console.log(err);

    res.send(err);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
