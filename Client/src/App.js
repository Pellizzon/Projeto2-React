import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import "./static/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SpotifyWebApi from 'spotify-web-api-js';
import request from 'request';
import standard from './static/standard.png';

var spotifyApi = new SpotifyWebApi();

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  e = r.exec(q)
  while (e) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
    e = r.exec(q);
  }
  return hashParams;
}

function App() {

  const token = getHashParams().access_token;
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  const [user, setUser] = useState();
  const [playlist, setPlaylist] = useState();

  //User information
  useEffect(() => {
    const getUser = async () => {
      spotifyApi.getMe().then((data) => {
        setUser(data);
      })
    }
    const token = spotifyApi.getAccessToken();
    if (token) {
      getUser();
    }
  }, []);

  //Playlist information
  useEffect(() => {
    const getPlaylist = async () => {
      var options = {
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50',
        headers: { 'Authorization': 'Bearer ' + spotifyApi.getAccessToken() },
        json: true
      };

      request.get(options, (error, response, body) => {
        setPlaylist(body.items);
      });
    }
    const token = spotifyApi.getAccessToken();
    if (token) {
      getPlaylist();
    }
  }, []);

  if (playlist && user && token) {
    return (
      <div className="app">
        <div>
          <Header title="My Festival" />
        </div>
        <span className="subheader">
          <div>
            Logged in as {user.display_name}
            <p>{user.email}</p>
            <p>{user.country}</p>
            <p>{user.id}</p>
            {typeof (user.images[0]) !== "undefined" && (
              <p><img src={user.images[0].url} className='rounded-circle' width="60" height="60" alt='user pic' /></p>
            )}
            {typeof (user.images[0]) === "undefined" && (
              <p><img src={standard} className='rounded-circle' width="60" height="60" alt='user pic' /></p>
            )}
          </div>
        </span>
        <p><a href="localhost:3000" className="btn btn-success">Logout</a></p>
        <div className="list">{playlist.map((obj, index) => {
          return (
            <div className="card" key={index}>
              <h1>{index + 1}</h1>
              <div className="content">
                <p key={index.toString() + "Track"}>Track: {playlist[index].name}</p>
                <p key={index.toString() + "Artist"}>Artists: {playlist[index].artists[0].name}</p>
                <p key={index.toString() + "Album"}>Album: {playlist[index].album.name}</p>
              </div>
              <img src={playlist[index].album.images[0].url} width="60" height="60" alt="album pic" />
            </div>
          );
        })}
        </div>
      </div >
    );
  }

  return (
    <div className="app">
      <div>
        <Header title="My Festival" />
      </div>
      <span className="subheader">
        <a href='localhost:8888/login' className="link" >Login with Spotify</a>
      </span>
    </div >
  );
}

export default App;
