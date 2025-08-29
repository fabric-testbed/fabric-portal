import React, { useEffect, useState } from "react";
import { useHubspotForm } from '@aaronhayes/react-use-hubspot-form';

const NewsletterHubspot = () => {
  const [ready, setReady] = useState(false);
  const { loaded, error } = useHubspotForm({
    portalId: '6342968',
    formId: '05693d2f-b08d-4def-8fa7-d31d54c74a59',
    target: '#fabric-newsletter-hubspot-form'
  });

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null; 

  return (
    <div style={{ minHeight: "400px" }}>
      {!loaded && <p>Loading...</p>}
      {error && <p>Error loading form.</p>}
      <div id="fabric-newsletter-hubspot-form"></div>
    </div>
  );
};

export default NewsletterHubspot;
