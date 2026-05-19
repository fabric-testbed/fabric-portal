import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import QuotaCard from "./QuotaCard";
import { getQuotas } from "@/services/quotaService";

function Quotas({ projectId, canManage }) {
  const [quotas, setQuotas] = useState([]);
  const [showZeroLimit, setShowZeroLimit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotas() {
      try {
        const { data } = await getQuotas(projectId);
        setQuotas(data.results || []);
      } catch {
        toast.error("Failed to load service credit information.");
      } finally {
        setIsLoading(false);
      }
    }
    if (projectId) fetchQuotas();
  }, [projectId]);

  const activeQuotas = quotas.filter(q => q.quota_limit !== 0);
  const zeroLimitQuotas = quotas.filter(q => q.quota_limit === 0);

  const handleUpdate = (uuid, updated) => {
    setQuotas(prev => prev.map(q => q.uuid === uuid ? { ...q, ...updated } : q));
  };

  const renderCard = (quota, index, prefix) => (
    <div className="col-6" key={`${prefix}-${index}`}>
      <QuotaCard
        data={quota}
        projectId={projectId}
        canManage={canManage}
        onUpdate={handleUpdate}
      />
    </div>
  );

  if (isLoading) {
    return (
      <div id="service-credit">
        <h4 className="mb-3">Service Unit</h4>
        <div className="text-muted">Loading service credit information...</div>
      </div>
    );
  }

  return (
    <div id="service-credit">
      <h4 className="mb-3">Service Unit</h4>
      {quotas.length === 0 && (
        <div className="alert alert-primary" role="alert">
          No service credit information available for this project.
        </div>
      )}
      <div className="row text-sm-size">
        {activeQuotas.map((quota, index) => renderCard(quota, index, "quota-card"))}
      </div>
      {zeroLimitQuotas.length > 0 && (
        <div className="mt-3">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowZeroLimit(prev => !prev)}
          >
            {showZeroLimit ? "▲" : "▼"} Unavailable Credits ({zeroLimitQuotas.length})
          </button>
          {showZeroLimit && (
            <div className="row text-sm-size mt-2">
              {zeroLimitQuotas.map((quota, index) => renderCard(quota, index, "quota-zero-card"))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Quotas;
