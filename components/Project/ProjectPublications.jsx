import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import SpinnerWithText from "../common/SpinnerWithText";
import { getPublicationsByProject } from "@/services/publicationService";

function ProjectPublications({ projectId }) {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("year");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    const loadPublications = async () => {
      try {
        const { data } = await getPublicationsByProject(projectId);
        setPublications(data.results || []);
      } catch (err) {
        toast.error("Failed to load publications.");
      } finally {
        setLoading(false);
      }
    };
    loadPublications();
  }, [projectId]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir(field === "year" ? "desc" : "asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="ms-1 text-muted" />;
    return sortDir === "asc"
      ? <ArrowUp size={14} className="ms-1" />
      : <ArrowDown size={14} className="ms-1" />;
  };

  const getFieldValue = (pub, field) => {
    if (field === "authors") {
      return (pub.authors || []).map((a) => a.author_name || a.display_name).join(", ").toLowerCase();
    }
    return (pub[field] || "").toLowerCase();
  };

  const sorted = [...publications].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    return dir * getFieldValue(a, sortField).localeCompare(getFieldValue(b, sortField));
  });

  if (loading) {
    return <SpinnerWithText text="Loading publications..." />;
  }

  if (publications.length === 0) {
    return (
      <div className="alert alert-primary" role="alert">
        No publications associated with this project yet.
      </div>
    );
  }

  return (
    <div>
      <div className="text-end text-muted mb-2">
        Displaying <strong>{publications.length}</strong> publications
      </div>
      <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th
              role="button"
              onClick={() => handleSort("title")}
              style={{ cursor: "pointer", minWidth: "250px" }}
            >
              TITLE {getSortIcon("title")}
            </th>
            <th
              role="button"
              onClick={() => handleSort("year")}
              style={{ cursor: "pointer", width: "80px" }}
            >
              YEAR {getSortIcon("year")}
            </th>
            <th
              role="button"
              onClick={() => handleSort("authors")}
              style={{ cursor: "pointer", minWidth: "200px" }}
            >
              RESEARCHERS {getSortIcon("authors")}
            </th>
            <th
              role="button"
              onClick={() => handleSort("venue")}
              style={{ cursor: "pointer", minWidth: "180px" }}
            >
              VENUE {getSortIcon("venue")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((pub) => {
            const authors = (pub.authors || [])
              .map((a) => a.author_name || a.display_name)
              .join(", ");
            return (
              <tr key={pub.uuid}>
                <td>
                  {pub.link ? (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer">
                      {pub.title} <ExternalLink size={14} className="ms-1" />
                    </a>
                  ) : (
                    pub.title
                  )}
                </td>
                <td>{pub.year}</td>
                <td>{authors}</td>
                <td>{pub.venue}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default ProjectPublications;
