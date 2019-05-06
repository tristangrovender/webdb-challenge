exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("actions")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("actions").insert([
        {
          id: 1,
          notes: "Breakfast",
          description: "Eating breakfast",
          is_complete: false
        },
        {
          id: 2,
          notes: "Lunch",
          description: "Eating lunch",
          is_complete: true
        },
        {
          id: 3,
          notes: "Dinner",
          description: "Eating dinner",
          is_complete: false
        }
      ]);
    });
};
