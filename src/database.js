import fs from 'node:fs/promises';
import { URL } from 'node:url';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex(row => row.id === id);

    if (index > -1) {
      this.#database[table][index] = { ...this.#database[table][index], ...data };
      this.#persist();
      return true;
    } else {
      return false;
    }
  }

  delete(table, id) {
    const index = this.#database[table].findIndex(row => row.id === id);

    if (index > -1) {
      this.#database[table].splice(index, 1);
      this.#persist();
    }

    return
  }

  complete(table, id) {
    const task = this.#database[table].findIndex(row => row.id === id);

    if (task === -1) {
      return "not_found";
    }
    if (this.#database[table][task].completed_at === null) {
      this.#database[table][task] = {
        ...this.#database[table][task],
        completed_at: new Date().toLocaleString('pt-BR')
      };
      this.#persist();
      return "completed";
    } else {
      this.#database[table][task] = {
        ...this.#database[table][task],
        completed_at: null
      };
      this.#persist();
      return "uncompleted";
    }
  }
}