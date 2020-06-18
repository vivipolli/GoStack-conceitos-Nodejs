const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {  title, url, techs } = request.body; 

  const projectIndex = repositories.find(repo => repo.id === id);

  if (projectIndex < 0 ) {
    return response.status(400).json({ error: "Project not found"})
  }

  const repository = {
    id, 
    title,
    url,
    techs,
  };

  repositories[projectIndex] = repository;
  
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.find(repo => repo.id === id);

  if (projectIndex < 0 ) {
    return response.status(400).json({ error: "Project not found"})
  }

  repositories.splice(projectIndex, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.find(repo => repo.id === id);

  if (projectIndex < 0 ) {
    return response.status(400).json({ error: "Project not found"})
  }

  const project = repositories.map((item, key) => {
    let like = item.likes + 1;
    if (item.id === id) {
      return {
        id: item.id, 
        title: item.title,
        url: item.url,
        techs: item.techs,
        likes: like,
      }
    }
  });

  repositories[projectIndex] = project;

  return response.json(project);
  
});

module.exports = app;
