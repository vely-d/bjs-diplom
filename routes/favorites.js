const express = require('express');

const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

router.get('/', (request, response) => {
  const user = db.get('users').find({ login: request.session.login }).value();

  if (!user) {
    response.json({ success: false, error: 'Пользователь не найден' });
    return;
  }

  // i just hate this guy, can't help it
  if (user.login === 'oleg@demo.ru') {
    response.json({ success: false, error: 'just fuck you man, straight up >:(' });
    return;
  }

  const favorites = db.get('favorites').value()[user.id];
  response.json({ success: true, data: favorites || {} });
});

router.post('/add', (request, response) => {
  const { id, name } = request.body;
  const user = db.get('users').find({ login: request.session.login }).value();
  const newFavoriteExists = Boolean(db.get('users').find({ id: +id }).value()); // prereqs for additional condition

  if (!user) {
    response.json({ success: false, error: 'Пользователь не найден' });
    return;
  }

  if(Number.isNaN(Number(id))){
    response.json({ success: false, error: 'Значение id должно быть числом' });
    return;
  }

  if (id === '' || name === '') {
    response.json({ success: false, error: 'Поля для ввода должны быть заполенны' });
    return;
  }

  const favorites = db.get('favorites').value()[user.id] || {};
  if (favorites[id]) {
    response.json({ success: false, error: 'Такой пользователь уже есть в списке' });
    return;
  }

  if (Number(id) === user.id) {
    response.json({ success: false, error: 'Нельзя добавить себя в избранное' });
    return;
  }

  // additional condition
  // it kinda makes targetUser checkup useless though
  if (!newFavoriteExists) {
    response.json({ success: false, error: "can't add a non-existing user to favorites" });
    return;
  }

  favorites[id] = name;
  db.set(`favorites.${user.id}`, favorites).write();
  response.json({ success: true, data: db.get('favorites').value()[user.id] });
});

router.post('/remove', (request, response) => {
  const { id } = request.body;
  const user = db.get('users').find({ login: request.session.login }).value();

  if (!user) {
    response.json({ success: false, error: 'Пользователь не найден' });
    return;
  }

  const favorites = db.get('favorites').value()[user.id];
  if (!favorites[id]) {
    response.json({ success: false, error: 'Удаляемый пользователь не найден' });
    return;
  }

  delete favorites[id];

  db.set(`favorites.${user.id}`, favorites).write();
  response.json({ success: true, data: db.get('favorites').value()[user.id] || {} });
});

module.exports = router;
