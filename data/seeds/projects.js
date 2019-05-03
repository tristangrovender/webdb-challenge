
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('projects').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('projects').insert([
        {id: 1, description: 'project #1 is fun', name: 'project1', is_complete: true},
        {id: 2, description: 'project #2 is great', name: 'project2', is_complete: true},
        {id: 3, description: 'project #3 is fantastic', name: 'project3', is_complete: false}
      ]);
    });
};