const sharp = require('sharp');
const fs = require('fs');

async function processLogos() {
  const fullLogoPath = 'C:/Users/phlim/.gemini/antigravity/brain/462f7daa-392f-49f3-889b-1c7c784e6e88/.user_uploaded/media_1787679549417.png';
  const squareIconPath = 'C:/Users/phlim/.gemini/antigravity/brain/462f7daa-392f-49f3-889b-1c7c784e6e88/.user_uploaded/media_1787679560296.png';

  // 1. Process Full Logo to Transparent (White on transparent)
  const fullImg = sharp(fullLogoPath).ensureAlpha();
  const { data: fullData, info: fullInfo } = await fullImg.raw().toBuffer({ resolveWithObject: true });

  const outFull = Buffer.from(fullData);
  for (let i = 0; i < outFull.length; i += 4) {
    const r = outFull[i];
    const g = outFull[i + 1];
    const b = outFull[i + 2];

    // Distance to white (255,255,255)
    const isWhite = r > 190 && g > 190 && b > 190;
    if (isWhite) {
      outFull[i] = 255;
      outFull[i + 1] = 255;
      outFull[i + 2] = 255;
      outFull[i + 3] = 255;
    } else {
      // Calculate alpha based on how close it is to white
      const whiteness = Math.min(r, g, b);
      if (whiteness > 140) {
        const factor = (whiteness - 140) / (255 - 140);
        outFull[i] = 255;
        outFull[i + 1] = 255;
        outFull[i + 2] = 255;
        outFull[i + 3] = Math.round(factor * 255);
      } else {
        outFull[i + 3] = 0; // Completely transparent
      }
    }
  }

  await sharp(outFull, {
    raw: {
      width: fullInfo.width,
      height: fullInfo.height,
      channels: 4,
    },
  })
    .png()
    .toFile('public/images/brutal-logo-white-transparent.png');

  // 2. Process Square Icon to Transparent
  const iconImg = sharp(squareIconPath).ensureAlpha();
  const { data: iconData, info: iconInfo } = await iconImg.raw().toBuffer({ resolveWithObject: true });
  const outIcon = Buffer.from(iconData);

  for (let i = 0; i < outIcon.length; i += 4) {
    const r = outIcon[i];
    const g = outIcon[i + 1];
    const b = outIcon[i + 2];

    const isWhite = r > 190 && g > 190 && b > 190;
    if (isWhite) {
      outIcon[i] = 255;
      outIcon[i + 1] = 255;
      outIcon[i + 2] = 255;
      outIcon[i + 3] = 255;
    } else {
      const whiteness = Math.min(r, g, b);
      if (whiteness > 140) {
        const factor = (whiteness - 140) / (255 - 140);
        outIcon[i] = 255;
        outIcon[i + 1] = 255;
        outIcon[i + 2] = 255;
        outIcon[i + 3] = Math.round(factor * 255);
      } else {
        outIcon[i + 3] = 0;
      }
    }
  }

  await sharp(outIcon, {
    raw: {
      width: iconInfo.width,
      height: iconInfo.height,
      channels: 4,
    },
  })
    .png()
    .toFile('public/images/brutal-icon-white-transparent.png');

  // 3. Create an Orange Icon on Transparent Background (Brand Orange: #FF5500)
  const outOrangeIcon = Buffer.from(outIcon);
  for (let i = 0; i < outOrangeIcon.length; i += 4) {
    if (outOrangeIcon[i + 3] > 0) {
      outOrangeIcon[i] = 255;     // R
      outOrangeIcon[i + 1] = 85;  // G
      outOrangeIcon[i + 2] = 0;   // B
    }
  }

  await sharp(outOrangeIcon, {
    raw: {
      width: iconInfo.width,
      height: iconInfo.height,
      channels: 4,
    },
  })
    .png()
    .toFile('public/images/brutal-icon-orange-transparent.png');

  console.log('All transparent logos and icons generated successfully!');
}

processLogos().catch(console.error);
