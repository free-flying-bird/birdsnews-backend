## Backend for BirdsNews
## Version v1.0.1
## It's the backend for working with the database.
### With my Backend you can get information about users and articles with saved news.
## What i used:
### HTML, CSS, JS, Webpack, NODE.JS, NPM, EXPRESS.JS, Mongoose, Mongo, Eslint
### How to use (instruction for terminal):
### 1) Install NODE.JS;
### 2) Make clone of repository: git clone https://github.com/sokolik90/birdsnews-backend.git
### 3) Install NPM: npm install;
### 4) Install Express.js: npm install express --save;
### For use command (starts the app on the local server: localhost:3000):
#### npm run start;
### For development use (with hot reload) command:
#### npm run dev.
### Address of database Mongoose: mongodb://localhost:27017/mydb
### Address of my website: https://birdsnews.tk
### Public IP of my wedsite: 178.154.226.22
### Requests that you can use:
#### GET localhost:3000/users/id (birdsnews.tk/users/id) - return information about user, which id you enter;
#### POST localhost:3000/signup (birdsnews.tk/users) - create new user from your sent JSON file, which should be has 3 categories: name, email, password (exam: {"name": "name", "email": "email", "password": "password"});
#### POST localhost:3000/signup (birdsnews.tk/users) - authorize the user with the email and the password from your sent JSON file, which should be has 2 categories: email, password (exam: {"email": "email", "password": "password"});
#### GET localhost:3000/articles (birdsnews.tk/articles) - return JSON with information about all articles and owners of articles;
#### POST localhost:3000/articles (birdsnews.tk/articles) - create new article from your sent JSON file, which should be has categories: keyword, title, text, date, source, link, image (exam: {{"keyword": "keyword", "title": "title", "text": "text", "date": "date", "source": "source", "link": "URL", "image": "URL"}), the "owner" automatically added;
#### DELETE localhost:3000/articles/id (birdsnews/articles/id) - delete article which id you entered and return JSON with deleted article;
