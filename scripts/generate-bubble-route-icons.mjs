import fs from 'node:fs';
import path from 'node:path';

const outputDir = '/home/ubuntu/webdev-static-assets/bubble-pop-route-icons';
fs.mkdirSync(outputDir, { recursive: true });

const palette = {
  navy: [0.09, 0.16, 0.25, 1],
  white: [1, 1, 1, 1],
  teal: [0.11, 0.73, 0.70, 1],
  coral: [1, 0.35, 0.23, 1],
  yellow: [1, 0.76, 0.17, 1],
  blue: [0.17, 0.52, 0.96, 1],
  violet: [0.50, 0.34, 0.92, 1],
  green: [0.19, 0.76, 0.39, 1],
  pink: [0.94, 0.31, 0.62, 1],
};

const staticValue = (value, ix) => ({ a: 0, k: value, ...(ix ? { ix } : {}) });

const transform = (x = 0, y = 0, rotation = 0) => ({
  ty: 'tr',
  p: staticValue([x, y], 2),
  a: staticValue([0, 0], 1),
  s: staticValue([100, 100], 3),
  r: staticValue(rotation, 6),
  o: staticValue(100, 7),
  sk: staticValue(0, 4),
  sa: staticValue(0, 5),
  nm: 'Transform',
});

const group = (name, items, x = 0, y = 0, rotation = 0) => ({
  ty: 'gr', nm: name, it: [
    ...items,
    transform(x, y, rotation),
  ], np: items.length + 1, cix: 2, bm: 0, ix: 1, mn: 'ADBE Vector Group', hd: false,
});

const rect = (name, width, height, color, x = 0, y = 0, radius = 10, rotation = 0) => group(name, [
  { ty: 'rc', d: 1, s: staticValue([width, height], 2), p: staticValue([0, 0], 3), r: staticValue(radius, 4), ix: 1, nm: `${name} shape`, mn: 'ADBE Vector Shape - Rect', hd: false },
  { ty: 'fl', c: staticValue(color, 4), o: staticValue(100, 5), r: 1, bm: 0, ix: 2, nm: `${name} fill`, mn: 'ADBE Vector Graphic - Fill', hd: false },
], x, y, rotation);

const ring = (name, width, height, color, thickness, x = 0, y = 0) => group(name, [
  { ty: 'el', d: 1, s: staticValue([width, height], 2), p: staticValue([0, 0], 3), ix: 1, nm: `${name} ellipse`, mn: 'ADBE Vector Shape - Ellipse', hd: false },
  { ty: 'st', c: staticValue(color, 3), o: staticValue(100, 4), w: staticValue(thickness, 5), lc: 2, lj: 2, ml: staticValue(4, 6), bm: 0, ix: 2, nm: `${name} stroke`, mn: 'ADBE Vector Graphic - Stroke', hd: false },
], x, y);

const dot = (name, size, color, x = 0, y = 0) => group(name, [
  { ty: 'el', d: 1, s: staticValue([size, size], 2), p: staticValue([0, 0], 3), ix: 1, nm: `${name} ellipse`, mn: 'ADBE Vector Shape - Ellipse', hd: false },
  { ty: 'fl', c: staticValue(color, 4), o: staticValue(100, 5), r: 1, bm: 0, ix: 2, nm: `${name} fill`, mn: 'ADBE Vector Graphic - Fill', hd: false },
], x, y);

const baseLayer = (name, items, motion = true) => ({
  ddd: 0,
  ind: 1,
  ty: 4,
  nm: name,
  sr: 1,
  ks: {
    o: staticValue(100, 11),
    r: staticValue(0, 10),
    p: staticValue([150, 150, 0], 2),
    a: staticValue([0, 0, 0], 1),
    s: staticValue([100, 100, 100], 6),
  },
  ao: 0,
  shapes: items,
  ip: 0,
  op: 120,
  st: 0,
  bm: 0,
});

const animation = (name, items) => ({
  v: '5.7.4', fr: 30, ip: 0, op: 120, w: 300, h: 300, nm: name, ddd: 0, assets: [],
  layers: [
    baseLayer(name, items),
    baseLayer('soft halo', [dot('halo outer', 206, [0.98, 0.97, 0.93, 1])], false),
  ],
});

const icons = {
  ruler: animation('Length Ruler', [
    rect('ruler body', 164, 52, palette.yellow, 0, 5, 14, -12),
    rect('ruler edge', 164, 8, palette.coral, 0, -14, 4, -12),
    ...[-57, -28, 0, 28, 57].map((x, index) => rect(`ruler tick ${index + 1}`, 7, index % 2 ? 24 : 34, palette.navy, x, 7, 3, -12)),
    dot('ruler glint', 20, palette.white, -53, -12),
  ]),
  scale: animation('Mass Scale', [
    rect('scale base', 130, 26, palette.coral, 0, 55, 13),
    rect('scale stem', 20, 74, palette.navy, 0, 13, 8),
    rect('scale beam', 162, 14, palette.yellow, 0, -29, 7),
    dot('left pan', 62, palette.blue, -63, 12),
    dot('right pan', 62, palette.green, 63, 12),
    ring('scale dial', 53, 53, palette.white, 7, 0, 10),
    rect('dial pointer', 7, 23, palette.white, 9, 1, 4, 35),
  ]),
  bottle: animation('Capacity Bottle', [
    rect('bottle glass', 88, 145, palette.blue, 0, 16, 29),
    rect('bottle liquid', 72, 57, palette.teal, 0, 53, 22),
    rect('bottle cap', 45, 19, palette.coral, 0, -69, 7),
    rect('bottle neck', 35, 27, palette.yellow, 0, -49, 8),
    dot('bottle shine', 21, palette.white, -24, -18),
    dot('water sparkle', 12, palette.white, 24, 43),
  ]),
  clock: animation('Time Clock', [
    dot('clock face', 166, palette.yellow),
    ring('clock glass rim', 166, 166, palette.white, 8),
    rect('clock hand minute', 10, 55, palette.navy, 14, -18, 5, 32),
    rect('clock hand hour', 12, 40, palette.coral, -10, -11, 6, -52),
    dot('clock hub', 22, palette.navy),
    dot('clock shine', 22, palette.white, -43, -43),
  ]),
  stopwatch: animation('Elapsed Time Stopwatch', [
    dot('stopwatch face', 142, palette.violet),
    ring('stopwatch rim', 142, 142, palette.white, 8),
    rect('stopwatch crown', 40, 21, palette.yellow, 0, -84, 7),
    rect('stopwatch hand', 9, 48, palette.white, 16, -13, 5, 45),
    dot('stopwatch hub', 19, palette.coral),
    dot('stopwatch shine', 19, palette.white, -35, -39),
  ]),
  calculator: animation('Add and Subtract Calculator', [
    rect('calculator body', 126, 171, palette.green, 0, 0, 25),
    rect('calculator display', 88, 35, palette.white, 0, -48, 11),
    ...[-31, 0, 31].flatMap((x, col) => [-1, 27, 55].map((y, row) => dot(`calculator key ${col}-${row}`, 20, (col + row) % 2 ? palette.yellow : palette.blue, x, y))),
    rect('calculator plus', 7, 27, palette.white, 32, 55, 3),
    rect('calculator plus cross', 27, 7, palette.white, 32, 55, 3),
    dot('calculator shine', 17, palette.white, -35, -68),
  ]),
  abacus: animation('Multiply and Divide Abacus', [
    rect('abacus frame', 168, 134, palette.coral, 0, 0, 21),
    ...[-40, 0, 40].map((y, index) => rect(`abacus rod ${index + 1}`, 130, 8, palette.navy, 0, y, 4)),
    ...[-40, 0, 40].flatMap((y, row) => [-49, -12, 25, 58].map((x, index) => dot(`abacus bead ${row}-${index}`, 29, [palette.yellow, palette.blue, palette.green, palette.violet][index], x, y))),
    dot('abacus shine', 17, palette.white, -56, -49),
  ]),
};

for (const [name, data] of Object.entries(icons)) {
  fs.writeFileSync(path.join(outputDir, `${name}.json`), JSON.stringify(data));
}

console.log(JSON.stringify({ outputDir, icons: Object.keys(icons) }));
