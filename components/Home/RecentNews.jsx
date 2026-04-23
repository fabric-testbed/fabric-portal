import React, { useState, useEffect } from "react";
import { getActiveNews } from "../../services/announcementService";
import NewsCard from "./NewsCard";
import { toast } from "react-toastify";

function RecentNews() {
  const [showSpinner, setShowSpinner] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      setShowSpinner(true);

      try {
        const { data: res } = await getActiveNews();
        let newsData = res.results;
        newsData = newsData.map(update => {
          const long_date = update.display_date
          update.display_date = long_date.substring(0, 10);
          return update;
        })
        setNews(newsData);
        setShowSpinner(false);
      } catch (err) {
        setShowSpinner(false);
        toast.error("Failed to load recent news. Please reload this page.");
      }
    };
    fetchNews();
  }, []);

  return (
    <div>
      {
        news.length === 0 ? <div className="mt-3 ms-4">No recent news available.</div> :
        <NewsCard showSpinner={showSpinner} news={news} />
      }
    </div>
  );
}

export default RecentNews;
