import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateQuota } from "@/services/quotaService";

function QuotaCard({ data, projectId, canManage, onUpdate }) {
  const resourceTypeLabel = typeof data.resource_type === "object"
    ? (data.resource_type?.value ?? data.resource_type?.name ?? "")
    : data.resource_type;
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLimit, setEditLimit] = useState(data.quota_limit);
  const [editUsed, setEditUsed] = useState(data.quota_used);

  const usedPercent = data.quota_limit > 0
    ? Math.min((data.quota_used / data.quota_limit) * 100, 100)
    : 0;

  const freePercent = data.quota_limit === 0 ? 0 : 100 - usedPercent;

  const handleEditSave = async () => {
    try {
      const body = {
        project_uuid: projectId,
        quota_limit: Number(editLimit),
        quota_used: Number(editUsed),
        resource_type: typeof data.resource_type === "object" ? data.resource_type.name : data.resource_type,
        resource_unit: data.resource_unit,
      };
      await updateQuota(data.uuid, body);
      const updated = { ...data, quota_limit: body.quota_limit, quota_used: body.quota_used };
      toast.success(`Quota "${resourceTypeLabel}" updated successfully.`);
      setShowEditModal(false);
      onUpdate(data.uuid, updated);
    } catch {
      toast.error("Failed to update quota.");
    }
  };

  return (
    <>
      <div className="persistent-storage-card py-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <b>{resourceTypeLabel}</b>
          {canManage && (
            <button
              className="btn btn-sm btn-outline-primary py-0 px-2"
              onClick={() => { setEditLimit(data.quota_limit); setEditUsed(data.quota_used); setShowEditModal(true); }}
              disabled={!data.uuid}
              title={!data.uuid ? "This quota has no UUID and cannot be edited" : undefined}
            >
              Edit
            </button>
          )}
        </div>
        <div className="mb-2">
          <b>Used:</b> {data.quota_used.toFixed(2)} {data.resource_unit}
        </div>
        <div className="mb-2">
          <b>Limit:</b> {data.quota_limit.toLocaleString()} {data.resource_unit}
        </div>
        <div className="mb-1">
          <div className="progress" style={{ height: "8px" }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${freePercent}%` }}
              aria-valuenow={freePercent}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <small className="text-muted">{freePercent.toFixed(2)}% available</small>
        </div>
      </div>

      {showEditModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Quota — {resourceTypeLabel}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Quota Limit ({data.resource_unit})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editLimit}
                    onChange={(e) => setEditLimit(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Quota Used ({data.resource_unit})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editUsed}
                    onChange={(e) => setEditUsed(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-sm btn-primary" onClick={handleEditSave}>Save</button>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuotaCard;
