import React from "react";
import { getActiveNews } from "../../services/announcementService";
import NewsCard from "./NewsCard";
import { toast } from "react-toastify";

class RecentNews extends React.Component {
  state = {
    showSpinner: false,
    news: [],
  };

  async componentDidMount() {
    this.setState({ showSpinner: true });

    try {
      const { data: res } = await getActiveNews();
      let news = res.results;
      news = news.map(update => {
        const long_date = update.display_date
        update.display_date = long_date.substring(0, 10);
        return update;
      })
      this.setState({ news, showSpinner: false });
    } catch (err) {
      this.setState({ showSpinner: false });
      toast.error("Failed to load recent news. Please reload this page.");
    }
  }

  render() {
    const { news, showSpinner } = this.state;
    return (
      <div>
        {
          news.length === 0 ? <div className="mt-3 ml-4">No recent news available.</div> : 
          <NewsCard showSpinner={showSpinner} news={news} />
        }
      </div>
    );
  }
}

export default RecentNews;
