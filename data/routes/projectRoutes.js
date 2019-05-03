const express = require("express");
const knex = require("knex");
const knexConfig = require("../../knexfile");
const DB = knex(knexConfig.development);
const router = express.Router();

router.get("/", (req, res) => {
  DB("projects")
    .then(projects => {
      res.json(projects);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "Projects cannot be retrieved from the db." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  DB("projects")
    .where("projects.id", id)
    .then(project => {
      const thisProject = project[0];
      DB("actions")
        .select(
          "actions.id",
          "actions.description",
          "actions.notes",
          "actions.is_complete",
          "actions.project_id"
        )
        .where("actions.project_id", id)
        .then(actions => {
          if (!thisProject) {
            res.status(404).json({ err: "No project matching this id" });
          } else {
            res.json({
              id: thisProject.id,
              name: thisProject.name,
              description: thisProject.description,
              is_complete: thisProject.is_complete,
              actions: actions
            });
          }
        });
    })
    .catch(() => {
      res
        .status(404)
        .json({ error: "Info about this project could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  const project = req.body;
  if (project.name && project.description && project.is_complete) {
    DB("projects")
      .insert(project)
      .then(id => {
        res.status(201).json({ id: id[0] });
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: "Failed to insert the project into the db." });
      });
  } else {
    res.status(400).json({
      error:
        "Please provide a name, description, and if the project is completed or not."
    });
  }
});

module.exports = router;
