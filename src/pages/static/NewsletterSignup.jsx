import React from "react";
import MailchimpForm from "../../components/MailchimpForm";
import BackgroundImage from "../../imgs/network-bg.svg";

const NewsletterSignup = () => {
  return (
    <div className="container static-page pb-5">
      <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
      <h1 className="mb-4">Get Involved with FABRIC</h1>
      <h2 className="text-primary mb-4">
        Newsletter Signup
      </h2>
      <p>
      Interested in learning more about FABRIC? Sign up here to receive email announcements and be the first to hear about our community workshops, events, and news!
      </p>
      <MailchimpForm />
    </div>
  );
};

export default NewsletterSignup;
