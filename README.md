# Admin portal for managing AR statue uploaded on Invisible Cities from Georgia Tech Arts@Tech

https://invisible-cities-web.herokuapp.com

- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Deployment](#deployment)

Invisible Cities is a mobile dashboard for collaboratively developing AR monuments and expansive artworks in public squares.


## Getting Started
1) Install Node.js and npm
2) Run "npm install" in the root directory
3) Run "npm run dev"
4) Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

## Folder Structure
```
invisible-cities-web/
  node_modules/
  README.md
  package.json
  controllers/
  views/
  server.js
```
* `/controllers` keeps all the controllers/routes.
* `/views` has all the client-side files.
* `server.js` is the node.js server entry file.

## Deployment
1) Fork the repository
2) Create a file `.env` in root directory and fill in the correspoding keys as below
```
SECRET_KEY=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DB_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MSG_SENDER_ID=
```
3) Repeat [Getting Started](#getting-started) steps
4) Replace header/footer texts, logo images, and footer links in
* `/public/assets/images`
* `/views/partials/footer.ejs`
* `/views/partials/head.ejs`
* `/views/partials/header.ejs`
5) Check if the website works properly in [http://localhost:5000](http://localhost:5000)
6) Follow steps in `https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app`
