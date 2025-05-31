const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { imageSizeFromFile } = require("image-size/fromFile");

async function createThumbnails(srcDir, destDir, size = 200) {
  // fs.mkdirSync(destDir, { recursive: true });

  const files = fs.readdirSync(srcDir);

  for (const file of files) {
    // if (![".png"].includes(ext)) continue;
    // const srcFile = `${srcDir}${file}`;
    // const dimensions = await imageSizeFromFile(srcFile);
    // console.log(file, dimensions.width, dimensions.height);
    // const inputPath = path.join(srcDir, file);
    // const filename = file.replace(".png", "");
    // const outFile = `${srcDir}${filename}-thumbnail.png`;
    // console.log(
    //   `insert into productImage (productId, path, isThumbnail, sequence) values (1, 'dice/${filename}-thumbnail.png', 1, 1);`
    // );
    // console.log(outFile);
    // const outputPath = path.join(
    //   destDir,
    //   `${file.replace(".png", "")}-thumbnail.png`
    // );
    // try {
    //   await sharp(srcFile)
    //     .resize(size, size, {
    //       fit: "cover", // crop to fill the square
    //       position: "center",
    //     })
    //     .toFile(outFile);
    //   // console.log(`Created: ${outputPath}`);
    // } catch (err) {
    //   console.error(`Error processing ${file}: ${err.message}`);
    // }
  }
}

// Example usage:
createThumbnails("./public/images/dice/", "/public/images/dice", 200);
