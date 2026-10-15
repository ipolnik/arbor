# Arbor — сайт мебельной мастерской

Одностраничный каталог для телефонов: товары, контакты, заказ через WhatsApp. Хостинг: Netlify (бесплатно).

- `index.html` — сайт и панель «Управление». Содержимое берётся из `/api/content`; пока владелец ничего не сохранил — из `content/site.json`.
- Вход для владельца: адрес сайта + `/admin`, только пароль. Сменить пароль: Netlify → Project configuration → Environment variables → `ADMIN_PASSWORD`.
- `netlify/functions/` — вход, сохранение содержимого и загрузка фото (хранятся в Netlify Blobs).
