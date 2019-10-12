import React from "react";

const Header = props => {
  return (
    <header>
      <div className="header">
        <span>{props.title}</span>
      </div>

      <div className="subheader-body">
        <span className="subheader">
          <p>Powered by <a className="link" target="noopener" href="https://developer.spotify.com/documentation/web-api/">
            Spotify API
          </a>.
          </p>
        </span>
      </div>
    </header>
  );
};

export default Header;