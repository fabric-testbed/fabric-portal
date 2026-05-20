import React, { useState, useEffect } from "react";
import FacilityUpdateCard from "./FacilityUpdateCard";

function FacilityUpdates() {
  const [showSpinner, setShowSpinner] = useState(false);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      setShowSpinner(true);
      try {
        const res = await fetch("/api/announcements?announcement_type=facility&is_active=true&offset=0&limit=5");
        if (!res.ok) return;
        const data = await res.json();
        const updatesData = (data.results || []).map(update => ({
          ...update,
          display_date: update.display_date?.substring(0, 10),
        }));
        setUpdates(updatesData);
      } catch {
        // Non-critical — fail silently
      } finally {
        setShowSpinner(false);
      }
    };
    fetchUpdates();
  }, []);

  return (
    <div style={{ position: "absolute", top: "1.5rem", bottom: "1.5rem", left: "0.75rem", right: "0.75rem", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {
        updates.length === 0 ? <div className="mt-3 ms-4">No Facility Update available.</div> :
        <FacilityUpdateCard showSpinner={showSpinner} updates={updates} />
      }
    </div>
  );
}

export default FacilityUpdates;
