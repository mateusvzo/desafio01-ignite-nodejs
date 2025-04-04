import fs from 'node:fs';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CSVReader {
  constructor(filePath) {
    this.filePath = path.join(__dirname, filePath)
  }

  async readCSV() {
    const parser = fs
      .createReadStream(this.filePath)
      .pipe(parse({ delimiter: ';' }));

    let isFirstLine = true;

    for await (const record of parser) {
      if (isFirstLine) {
        isFirstLine = false;
        continue;
      }
      const [title, description] = record

      try {
        await fetch('http://localhost:3332/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        })
      } catch (error) {
        console.error(`Erro de coneção para ${title}`, error.message);
      }
    }
  }
}

(async () => {
  const reader = new CSVReader('tasksCsv.csv');
  await reader.readCSV();
})();

