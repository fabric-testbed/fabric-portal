import { useHubspotForm } from 'next-hubspot';

export default function HubspotForm() {
    const { isFormCreated, error } = useHubspotForm({
      portalId: '6342968',
      formId: '05693d2f-b08d-4def-8fa7-d31d54c74a59',
      target: '#hubspot-form-wrapper'
    });

    return (
      <div style={{ minHeight: "400px" }}>
        {!isFormCreated && <p>Loading...</p>}
        {error && <p>Error loading form.</p>}
        <div id="hubspot-form-wrapper" />
      </div>
    )
}
