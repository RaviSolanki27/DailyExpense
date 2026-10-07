const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height) {
  // CRC table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const body = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body), 0);
    return Buffer.concat([len, body, crc]);
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Raw image scanlines
  // 1 filter byte (0) per line + width * 4 bytes RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;

  for (let y = 0; y < height; y++) {
    raw[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      // Emerald gradient background with rounded corner effect
      const dx = x - width / 2;
      const dy = y - height / 2;
      const r = Math.sqrt(dx * dx + dy * dy);
      const isInside = r < width * 0.45;

      if (isInside) {
        // Emerald to teal gradient (#059669 -> #0284c7)
        const t = (x + y) / (width + height);
        raw[offset++] = Math.round(5 + t * (2 - 5)); // R
        raw[offset++] = Math.round(150 + t * (132 - 150)); // G
        raw[offset++] = Math.round(105 + t * (199 - 105)); // B
        raw[offset++] = 255; // Alpha
      } else {
        raw[offset++] = 9;
        raw[offset++] = 13;
        raw[offset++] = 22;
        raw[offset++] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, chunk('IHDR', ihdr), idat, iend]);
}

const dir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'icon-192x192.png'), createPNG(192, 192));
fs.writeFileSync(path.join(dir, 'icon-512x512.png'), createPNG(512, 512));
console.log('✅ Generated 192x192 and 512x512 icons successfully!');

