import React from "react";
import HubspotForm from 'react-hubspot-form'

const NewsletterSignup = () => {
  return (
    <div className="container static-page pb-5">
      <h1 className="mb-4">Get Involved with FABRIC</h1>
      <h2 className="text-primary mb-4">
        Newsletter Signup
      </h2>
      <p>
      Interested in learning more about FABRIC? Sign up here to receive email announcements and be the first to hear about our community workshops, events, and news!
      </p>
      <div className="divider div-transparent"></div>
      <HubspotForm
        portalId='6342968'
        formId='05693d2f-b08d-4def-8fa7-d31d54c74a59'
        onSubmit={() => console.log('Email Subscription Form Submitted!')}
        onReady={(form) => console.log('Email Subscription Form Ready!')}
        loading={<div>Loading...</div>}
      />
    </div>
  );
};

export default NewsletterSignup;
