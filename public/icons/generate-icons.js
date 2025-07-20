// This file is for documentation purposes only
// You would need to run this script separately to generate the icons

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = path.join(__dirname, 'source-icon.png');
const outputDir = __dirname;

async function generateIcons() {
  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon not found. Please create a source-icon.png file (at least 512x512)');
    return;
  }

  for (const size of sizes) {
    await sharp(sourceIcon)
      .resize(size, size)
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
    console.log(`Generated icon-${size}x${size}.png`);
  }
}

generateIcons().catch(console.error);