import React, { useState, useEffect } from "react";
import { getProjectById } from "../../../services/projectService";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Parser from 'html-react-parser';
import { LogIn } from "lucide-react";
import SpinnerWithText from "../../common/SpinnerWithText";

function PublicProjectProfile() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const parseFundingStr = (funding) => {
    if (funding.agency === "Other") {
      return `${funding.agency_other} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    } else if (funding.agency === "NSF") {
      return `${funding.agency} ${funding.directorate ? `| ${funding.directorate}` : ""} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    } else {
      return `${funding.agency} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectId = params.id;
        const { data } = await getProjectById(projectId);
        const proj = data.results[0];
        setProject(proj);
      } catch (err) {
        toast.error("Failed to load project.");
        if (err.response && err.response.status === 404) {
          router.push("/about/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <SpinnerWithText text="Loading project..." />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="public-project-profile fade-in">
      <div className="public-project-profile-upper">
        <h1>{project.name}</h1>
      </div>
      <div className="card">
        <h5 className="card-header">Project Details</h5>
        <div className="card-body">
          <h5 className="card-title pb-2 border-bottom text-primary">Description</h5>
          <p className="card-text mb-4"> {project.description ? Parser(project.description) : ""} </p>
          <h5 className="card-title pb-2 border-bottom text-primary">Funding Information</h5>
          <div className="card-text mb-4">
            {
              project.project_funding && project.project_funding.length > 0 &&
              <ul>
                {
                  project.project_funding.map((funding, index) => {
                    return <li
                        className="my-2"
                        key={`project-funding-${index}`}
                      >
                        { parseFundingStr(funding) }
                      </li>
                  })
                }
              </ul>
            }
            {
              project.project_funding && project.project_funding.length === 0 && <span className="fst-italic">
                This project has no funding added yet.
              </span>
            }
          </div>
          <h5 className="card-title pb-2 border-bottom text-primary">Community</h5>
          <p className="card-text mb-4">
            {
              project.communities && project.communities.length > 0 && project.communities.map((community, index) => {
                return (<span
                    className="badge bg-primary me-1"
                    key={`project-community-${index}`}
                  >
                    {community}
                  </span>)
              })
            }
            {
              project.communities && project.communities.length === 0 && <span className="fst-italic">
                This project has no community tag added yet.
              </span>
            }
          </p>
          <h5 className="card-title pb-2 border-bottom text-primary">Project Type</h5>
          <p className="card-text mb-4">
            { capitalizeFirstLetter(project.project_type) }
          </p>
        </div>
      </div>
      <Link href="/experiments">
        <button className="btn btn-sm btn-outline-primary my-4">
          <LogIn className="me-2" size={16} /> Back to Project List
        </button>
      </Link>
    </div>
  );
}

export default PublicProjectProfile;
