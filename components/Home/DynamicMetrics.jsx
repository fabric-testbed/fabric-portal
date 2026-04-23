"use client";
import React, { useState, useEffect } from "react";
import CountUp from 'react-countup';
import { getCoreApiMetrics, getOrchestratorMetrics } from "../../services/metricsService";
import { getPublications } from "../../services/publicationService.js";
import { toast } from "react-toastify";
import Link from "next/link";
import { LogIn } from "lucide-react";

function DynamicMetrics() {
  const [metricsItems, setMetricsItems] = useState([
    {
      name: "Total Slices",
      count: 0
    },
    {
      name: "Active Slices",
      count: 0
    },
    {
      name: "Total Users",
      count: 0
    },
    {
      name: "Total Projects",
      count: 0,
      link: "/experiments/public-experiments"
    },
    {
      name: "Publications Using FABRIC",
      count: 0,
      link: "/community/fabric-user-publications"
    }
  ]);

  const generateMetricsItems = (coreMetrics, sliceMetrics, publicationMetrics) => {
    const items = [];
    items.push({
      name: "Total Slices",
      count: sliceMetrics.slices.active_cumulative +  sliceMetrics.slices.non_active_cumulative
    });
    items.push({
      name: "Active Slices",
      count: sliceMetrics.slices.active_cumulative
    });

    items.push({
      name: "Total Users",
      count: coreMetrics.users.active_cumulative
    });
    items.push({
      name: "Total Projects",
      count: coreMetrics.projects.active_cumulative + coreMetrics.projects.non_active_cumulative,
      link: "/experiments/public-experiments"
    });
    items.push({
      name: "FABRIC User Publications",
      count: publicationMetrics.count,
      link: "/community/fabric-user-publications"
    });

    return items;
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data: resCoreMetrics } = await getCoreApiMetrics();
        const { data: resOrchestratorMetrics } = await getOrchestratorMetrics();
        const { data: resPublications } = await getPublications();
        setMetricsItems(generateMetricsItems(
          resCoreMetrics.results[0],
          resOrchestratorMetrics.results[0],
          resPublications
        ));
      } catch (err) {
        toast.error("Failed to load FABRIC metrics data.")
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="w-100 home-metrix">
      <div className="d-flex flex-column align-item-center justify-content-center px-5 mb-2">
        <div className="me-5 align-self-center">
          <img
            src="/imgs/logos/fabric-logo-without-text.png"
            height="100"
            className="d-inline-block align-top"
            alt=""
          />
        </div>
        <div>
          <h2 className="text-center my-5">
            <b>FABRIC</b>'s mission is to be an infrastructure to explore impactful new ideas that are impossible or impractical with the current Internet.
          </h2>
        </div>
      </div>
      <div className="row w-100">
        {
          metricsItems.map((i, index) => {
            return (
              <div
                className="col d-flex flex-column align-items-center"
                key={`homepage-metrics-${index}`}
              >
                <div className="hp-metrics-number">
                  <CountUp
                    end={i.count}
                    duration={1.5}
                    formatValue={(n) => Intl.NumberFormat("en-US").format(n)}
                    style={{
                      transition: "0.8s ease-out",
                      fontSize: 48,
                      transitionProperty: "background-color, color, opacity"
                    }}
                  />
                </div>
                <div className="home-metrics-text">
                  {i.name}
                  {
                    i.link && <Link href={i.link}>
                      <LogIn className="ms-2" size={16} />
                    </Link>
                  }
                </div>
            </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default DynamicMetrics;
