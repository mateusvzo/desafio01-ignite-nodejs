import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  // METHOD: GET -> concluded
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.writeHead(200).end(JSON.stringify(tasks));
    }
  },

  // METHOD: POST -> concluded
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toLocaleString('pt-BR'),
        updated_at: new Date().toLocaleString('pt-BR'),
      }

      database.insert('tasks', task);

      return res.writeHead(201).end();
    }
  },

  // METHOD: PUT -> concluded
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const updatedTask = {
        title,
        description,
        updated_at: new Date().toLocaleString('pt-BR'),
      }

      if (database.update('tasks', id, updatedTask)) {
        return res.writeHead(200).end('Task has been updated');
      }
      return res.writeHead(404).end('Task not found');
    }
  },

  // METHOD: DELETE -> concluded
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete('tasks', id)

      return res.writeHead(200).end('Task has been deleted');
    }
  },

  // METHOD: PATCH
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const result = (database.complete('tasks', id));

      if (result === "completed") {
        return res.writeHead(200).end('Task has been completed');
      }
      if (result === "uncompleted") {
        return res.writeHead(200).end('Task has been uncompleted');
      }
      if (result === "not_found") {
        return res.writeHead(404).end('Task not found');
      }
    }
  }
]