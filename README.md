# myFestival Web Application
This repository is uses React and Spotify's API to show the user his/her top 50 songs. It's possible to list the top 50 of different periods:

- Last 4 weeks
- Last 6 months
- All time

It also enables the creation of a playlist that contains all of the top 50 tracks listed in the selected period.

There are two parts to it, the auth-server, and the client. 

## Running it Locally

### 1) Create an App
- Visit https://developer.spotify.com/ 
- Log in and create an app
- Enter http://localhost:5000/callback as the redirect uri
- Save your changes
- Copy down the following: Redirect uri, client id, client secret

### 2)  Start Auth Server
- Navigate to the server directory `cd Server`
- Install the dependencies `npm i`
- Paste in the redirect uri, client id, and client secret you copied in step 1
- Run the Server `node app.js`

### 3)  Start Client
- On other console, navigate to the  client directory `cd Client`
- Install the dependencies `npm i`
- Run the Server `npm start`

### 4)  Use the App
- Visit http://localhost:3000
- Click 'Log in with Spotify' and log in (right click it)
