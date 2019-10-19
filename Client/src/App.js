import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import "./static/App.css";
import SpotifyWebApi from "spotify-web-api-js";
import request from "request";
import standard from "./static/standard.png";

var spotifyApi = new SpotifyWebApi();

function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  e = r.exec(q);
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
  const [search, setSearch] = useState("");
  const [myFestival, setMyFestival] = useState();
  const [term, setTerm] = useState();
  const [hover, setHover] = useState(false);
  const [show, setShow] = useState(false);
  const [close, setClose] = useState(true);

  const showNow = () => {
    setShow(true);
    setTimeout(function () {
      setShow(false);
    }, 3000);
  }

  //User information
  useEffect(() => {
    const tok = spotifyApi.getAccessToken();
    if (tok) {
      spotifyApi.getMe().then(data => {
        setUser(data);
      });
    }
  }, []);

  //Playlist information
  useEffect(() => {
    const tok = spotifyApi.getAccessToken();
    if (tok) {
      getTerm("short_term");
    }
  }, []);

  const getTerm = e => {
    var options = {
      url: `https://api.spotify.com/v1/me/top/tracks?time_range=${e}&limit=50`,
      headers: { Authorization: "Bearer " + spotifyApi.getAccessToken() },
      json: true
    };

    request.get(options, (error, response, body) => {
      setPlaylist(body.items);
      setTerm(e);
    });
  };

  if (playlist && user && token) {
    for (var i = 0; i < playlist.length; i++) {
      var ranking = i + 1;
      playlist[i]["ranking"] = ranking;
    }
    const filteredData = playlist.filter(item => {
      return item.name.toLowerCase().includes(search.toLowerCase());
    });

    const createPlaylist = async () => {
      try {
        const items = await spotifyApi.getUserPlaylists(user.id).then(({ items }) => {
          return items;
        })
        var id = null;
        items.forEach((el, i) => {
          if (el.name === "myFestival") {
            id = el.id;
          }
        })
        if (id) {
          setMyFestival(id);
          const tracks = await spotifyApi.getPlaylistTracks(id).then(({ items }) => {
            return items;
          })
          await spotifyApi.removeTracksFromPlaylist(id, tracks.map((el, i) => {
            return el.track.uri;
          }))
          await spotifyApi.addTracksToPlaylist(id, playlist.map((el, i) => {
            return el.uri;
          }))
        } else {
          setMyFestival("notFound");
        }
        showNow();
      } catch (err) {
        setMyFestival("notFound");
      }
    };

    return (
      <div id='logged' className="app">
        {!close && (
          <div className="w3-sidebar w3-bar-block w3-animate-left" id="mySidebar">
            <button id="closeButton" className="w3-bar-item"
              onClick={() => setClose(!close)}>Close &times;</button>
            <a id="logout" href="http://localhost:3000" className="w3-bar-item">Logout</a>
          </div>
        )}
        <div className="header_sidebar">
          {close && (
            <button id="sidebarButton" onClick={() => setClose(!close)}>&#9776;</button>
          )}
          <Header title1="my" title2="Festival" />
        </div>
        <span className="user">
          {typeof user.images[0] !== "undefined" && (
            <img src={user.images[0].url} className="user-img"
              width="60" height="60" alt="user pic" />
          )}
          {typeof user.images[0] === "undefined" && (
            <img src={standard} className="user-img"
              width="60" height="60" alt="user pic" />
          )}
          <div className="user-infos">
            <p>Logged in as {user.display_name}</p>
            <p>{user.email}</p>
          </div>
        </span>
        <div>
          {term === "short_term" && (
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  Last 4 weeks
              </Dropdown.Toggle>
                <Dropdown.Menu id='dropdown_menu'>
                  <Dropdown.Item as={"p"} onClick={() => getTerm("medium_term")}>Last 6 months</Dropdown.Item>
                  <Dropdown.Item as={"p"} onClick={() => getTerm("long_term")}>All-time</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          {term === "medium_term" && (
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  Last 6 months
              </Dropdown.Toggle>
                <Dropdown.Menu id='dropdown_menu'>
                  <Dropdown.Item as={"p"} onClick={() => getTerm("short_term")}>Last 4 weeks</Dropdown.Item>
                  <Dropdown.Item as={"p"} onClick={() => getTerm("long_term")}>All-time</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          {term === "long_term" && (
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  All-time
              </Dropdown.Toggle>
                <Dropdown.Menu id='dropdown_menu'>
                  <Dropdown.Item as={"p"} onClick={() => getTerm("short_term")}>Last 4 weeks</Dropdown.Item>
                  <Dropdown.Item as={"p"} onClick={() => getTerm("medium_term")}>Last 6 months</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          <Button
            className="term create"
            onClick={() => createPlaylist()}
            variant="dark"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Create <span id='logo1'>my</span><span id='logo2'>Festival</span> Playlist!
          </Button>
        </div>
        {typeof myFestival !== "undefined" && myFestival !== "notFound" && show && (
          <p className="message">myFestival Playlist Ready</p>
        )}

        {myFestival === "notFound" && show && <p className="message">Playlist not found...</p>}
        {hover && (
          <div className="message">
            <h5>Instructions</h5>
            <li>
              Create a playlist named <span id='logo1'>my</span><span id='logo2'>Festival</span>
            </li>
            <li>Set it to public</li>
            <li>Enjoy!</li>
          </div>
        )}
        <input className="search" type="text" onChange={e => setSearch(e.target.value)}
          placeholder="&#xF002;    Search Track Name..." value={search} />
        <div className="list">
          {filteredData.map((obj, index) => {
            return (
              <div key={index} id="cartao">
                <h1>{obj.ranking}</h1>
                <iframe
                  title={obj.album}
                  src={`https://open.spotify.com/embed?uri=spotify:track:${obj.id}`}
                  width="380"
                  height="380"
                  frameBorder="0"
                  allowtransparency="true"
                />
                {/* allow="encrypted-media" */}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div>
        <Header title1="my" title2="Festival" />
      </div>
      <span className="user">
        <a href="http://localhost:4000/login" className="link">
          Login with Spotify
        </a>
      </span>
    </div>
  );
}

export default App;
