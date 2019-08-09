## WeTube

Welcome to WeTube, the interactive video sharing app that lets you watch your favorite YouTube videos
in real-time with your friends.

To access the live version, click [here](https://bmmeehan3-youtube-theater-app.now.sh/).

That link should bring you to the landing page, which gives a brief description of the app, and provides
a link to either login (if you already have an account) or to register for a new account. 

Landing Page: ![screenshot of landing page](https://i.gyazo.com/ae2c4963fca8d31d89be65801e1d69db.png)

There is also a demo account listed if you just want to check it out without the hassle of creating an 
account.

Once you register an account and login, you will be taken to the main lobby, where you can select
from any of the available rooms to join and start sharing, or create a room of your own.

Main Lobby: ![screenshot of main lobby](https://i.gyazo.com/c53400482c5a662fb8b52a899cb346e3.png)

Once you select a room, you are brought to the theater page, where you can simply add a youtube link to the input field 

![screenshot of link input](https://i.gyazo.com/2d44ab11614b27657eb1243e582a1740.png)

and press 'Submit Video'. The video will automatically start playing on all clients connected to that same room.

![working theater room with playing video](https://i.gyazo.com/f2b64c71480cdaab23308045fee25718.png)

There is also a live chat for you to share reactions and thoughts with everyone connected to the room as
well.

Follow [this](https://github.com/bmtron/youtube-theater-server) link to discover the back-end that runs this app.

## Technology

WeTube was created with a multitude of different technologies. The client was built using HTML5 and CSS for the skeleton and skin, respectively, and uses React.js to deliver the main functionality. The backend uses Node.js and Express, and uses PostgreSQL as the database. Socket.io was used to deliver the real-time interactivity to the app.

## Backend API Endpoints

Supports JSON format.

### GET /api/users
Supports 'GET' for all users in the database. Returns all users.

### POST /api/users
Post a username and a password to the database. Passwords are hashed with bcrypt, and a JWT is required for proper user authentication. Username and password must be supplied to successfully POST. Password must be between 8-36 characters, and contain an uppercase, a lowercase, a number, and a special character

### GET /api/rooms
Returns all rooms that have been posted to the database. 

### POST /api/rooms
Allows the ability to add new rooms to the database. Requires only a name.

### DELETE /api/rooms/:room_id
Allows the ability to delete specific rooms based on the ID of the room in the database.

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.