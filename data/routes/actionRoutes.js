const express = require("express");
const knex = require("knex");
const knexConfig = require("../../knexfile");
const db = knex(knexConfig.development);
const router = express.Router();

router.get("/", (req, res) => {
  db("actions")
    .then(actions => {
      res.json(actions);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "Actions cannot be retrieved from the db." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db("actions")
    .where("actions.id", id)
    .then(project => {
      const thisProject = project[0];
      db("actions")
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
            res.status(404).json({ err: "invalid project id" });
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
  const action = req.body;
  if (
    action.description &&
    action.project_id &&
    action.notes &&
    typeof action.is_complete === "boolean"
  ) {
    db("projects")
      .where({ id: action.project_id })
      .first()
      .then(project => {
        if (!project) {
          res.status(404).json({ err: "invalid project id" });
        } else {
          db("actions")
            .insert(action)
            .then(id => {
              if (id[0]) {
                db("actions")
                  .where("actions.id", id[0])
                  .then(action => {
                    res.status(201).json(action);
                  });
              }
            })
            .catch(() => {
              res.status(500).json({ err: "Error creating action" });
            });
        }
      })
      .catch(() => {
        res.status(500).json({ err: "Failed to insert" });
      });
  } else {
    res.status(404).json({ message: "Please provide all fields" });
  }
});

module.exports = router;
