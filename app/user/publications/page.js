"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import SpinnerWithText from "@/components/common/SpinnerWithText";
import { getPublicationsByAuthor } from "@/services/publicationService";
import { useUserPage } from "../UserContext";

export default function UserPublicationsPage() {
  const { user } = useUserPage();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("year");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    if (!user?.uuid) return;
    const loadPublications = async () => {
      try {
        const { data } = await getPublicationsByAuthor(user.uuid);
        setPublications(data.results || []);
      } catch (err) {
        toast.error("Failed to load publications.");
      } finally {
        setLoading(false);
      }
    };
    loadPublications();
  }, [user?.uuid]);

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
    if (field === "project_name") {
      return (pub.project_name || "").toLowerCase();
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

  return (
    <div>
      {publications.length === 0 ? (
        <div className="alert alert-primary" role="alert">
          No publications found.
        </div>
      ) : (
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
                <th
                  role="button"
                  onClick={() => handleSort("project_name")}
                  style={{ cursor: "pointer", minWidth: "150px" }}
                >
                  FABRIC PROJECT {getSortIcon("project_name")}
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
                    <td>
                      {pub.project_uuid ? (
                        <a href={`/experiments/projects/${pub.project_uuid}#info`}>
                          {pub.project_name} <ExternalLink size={14} className="ms-1" />
                        </a>
                      ) : (
                        pub.project_name || ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
