"use client";
import React from "react";
import { HubspotProvider } from 'next-hubspot';
import NewsletterHubspot from "../../../components/HubspotForm";
export default function NewsletterSignup() {
  return (
    <div className="container static-page pb-5">
        <img src="/imgs/network-bg.svg" alt={`static page background`} className="static-page-bg"/>
        <h1 className="mb-4">Get Involved with FABRIC</h1>
        <h2 className="text-primary mb-4">
          Newsletter Signup
        </h2>
        <p>
        Interested in learning more about FABRIC? Sign up here to receive email announcements and be the first to hear about our community workshops, events, and news!
        </p>
        <div className="divider div-transparent"></div>
        <HubspotProvider>
            <NewsletterHubspot />
        </HubspotProvider>
    </div>
    );
};

