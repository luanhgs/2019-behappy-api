exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("tasks").del()
    .then(function () {
      // Inserts seed entries
      return knex("tasks").insert([
        {title: "Bom dia", description: "Você deu bom dia para alguém há 44 dias"},
        {title: "Ligação", description: "Você ligou para seus amigos há 44 dias"},
        {title: "Zap", description: "Envie um zap aos seus amigos em 6 horas"}
      ]);
    });
};