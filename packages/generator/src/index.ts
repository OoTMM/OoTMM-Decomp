import { promises as fs } from 'node:fs';
import path from 'node:path';

import { makeRandoFileSystem } from './file-system-builder';
import { buildRom } from './rom-builder';

async function run() {
  const fileSystem = await makeRandoFileSystem();
  const rom = await buildRom(fileSystem);
  const dir = path.resolve(__dirname, '..', '..', '..', 'out');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.resolve(dir, 'OoTMM.z64'), rom);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
