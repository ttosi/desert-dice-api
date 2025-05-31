const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const { imageSizeFromFile } = require("image-size/fromFile");

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

      console.log(srcFilePath);
      await createThumbnail(srcFilePath);

      await callback(srcFilePath);
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
  console.log(outputPath);
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
processFiles("./public/temp3", async (filePath) => {
  // console.log("Processing file:", filePath);
});
