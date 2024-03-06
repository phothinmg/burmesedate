import {
  getTimeZones,
  rawTimeZones,
  timeZonesNames,
  abbreviations,
} from "@vvo/tzdb";
import path from "path";
import fs from "fs";

const rt = rawTimeZones;
const raw = JSON.stringify(rt, null, 2);
const da = `

export const data = ${raw}

`;

const pat = path.join(process.cwd(), './src/wtApi/lib/tzone.ts')
fs.writeFileSync(pat, da);
