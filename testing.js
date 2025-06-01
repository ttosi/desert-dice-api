const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const { imageSizeFromFile } = require("image-size/fromFile");

const productId = 1;
var productOptionId = 1;
var sequence = 1;

async function processFiles(dir, callback) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const srcFilePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processFiles(srcFilePath, callback); // recurse
    } else {
      // console.log(await getDimensions(srcFilePath));
      // console.log(path.basename(srcFilePath));
      // console.log(path.dirname(srcFilePath));

      if (srcFilePath.includes("cover")) continue;

      // console.log(
      //   `INSERT INTO productImage (productOptionId, path, isThumbnail, sequence) VALUES (${productOptionId}, 'dice/${path.basename(
      //     srcFilePath
      //   )}', 0, ${sequence});`
      // );

      sequence++;

      // console.log(srcFilePath);
      await createThumbnail(srcFilePath);

      // await callback(srcFilePath);
    }
  }
}

const getDimensions = async (srcFilePath) => {
  const dimensions = await imageSizeFromFile(srcFilePath);
  return { width: dimensions.width, height: dimensions.height };
};

const createThumbnail = async (srcFilePath) => {
  const outputPath = `${path.dirname(srcFilePath)}/${path
    .basename(srcFilePath)
    .replace(".png", "-thumbnail.png")}`;
  // console.log(path.basename(srcFilePath));
  // console.log(outputPath);

  // console.log(srcFilePath);
  // console.log(
  //   `INSERT INTO productImage (productOptionId, path, isThumbnail, sequence) VALUES (${productOptionId}, 'dice/${path.basename(
  //     outputPath
  //   )}', 1, ${sequence});`
  // );

  try {
    await sharp(srcFilePath)
      .resize(200, 200, {
        fit: "cover",
        position: "center",
      })
      .toFile(outputPath);
  } catch (err) {
    console.error(`Error processing ${err.message}`);
  }
};

// Usage:
processFiles("../images/grave_bloom/", async (filePath) => {
  // console.log("Processing file:", filePath);
});
