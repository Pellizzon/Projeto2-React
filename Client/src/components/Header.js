import React from "react";

const Header = props => {
  return (
    <header>
      <div className="header">
        <span id="part1">{props.title1}</span><span>{props.title2}</span>
      </div>

      <div className="subheader-body">
        <span className="subheader">
          <p>Powered by <a className="link" target="_self" href="https://developer.spotify.com/documentation/web-api/">
            Spotify API
          </a>.
          </p>
        </span>
      </div>
    </header>
  );
};

export default Header;