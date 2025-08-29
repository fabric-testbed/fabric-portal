import React, { useEffect } from "react";

const TwitterContainer = ({ count = 10 }) => {
  useEffect(() => {
    const anchor = document.createElement('a')
    anchor.setAttribute('class', 'twitter-timeline')
    anchor.setAttribute('data-theme', 'light')
    anchor.setAttribute('width', '100%')
    anchor.setAttribute('data-tweet-limit', count)
    anchor.setAttribute('data-chrome', 'noheader nofooter noborders')
    anchor.setAttribute('href', 'https://twitter.com/FABRICtestbed')
    document.getElementsByClassName('twitter-embed')[0].appendChild(anchor)

    const script = document.createElement('script')
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js')
    document.getElementsByClassName('twitter-embed')[0].appendChild(script)
  }, [count])

  return (
    <div className="homepage-card card">
      <div className="card-header text-center">
        <b>Twitter Feed</b>
      </div>
      <div className="card-body py-2">
      <div className="twitter-embed"></div>
      </div>
    </div>
  );
};

export default TwitterContainer;