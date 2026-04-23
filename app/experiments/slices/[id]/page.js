"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import Link from "next/link";
import { toast } from "react-toastify";
import { LogIn, HelpCircle, ArrowLeftRight } from "lucide-react";
import { saveAs } from "file-saver";

// components
import DeleteModal from "@/components/common/DeleteModal";
import SpinnerWithText from "@/components/common/SpinnerWithText";
import CountdownTimer from "@/components/common/CountdownTimer";
import Graph from "@/components/SliceViewer/Graph";
import SliceViewerErrorBoundary from "@/components/SliceViewer/SliceViewerErrorBoundary";
import TerminalFormModal from "@/components/SliceViewer/TerminalFormModal";
import DetailForm from "@/components/SliceViewer/DetailForm";
import ErrorMessageAccordion from "@/components/SliceViewer/ErrorMessageAccordion";

// utils
import sleep from "@/utils/sleep";

// services
import {
  getSliceById,
  deleteSlice,
  extendSlice,
  installEphemeralKey
} from "@/services/sliceService";
import sliceParser from "@/services/parser/sliceParser";
import sliceErrorParser from "@/services/parser/sliceErrorParser";
import { generateKeyPairs } from "@/services/sshKeyService";

// data
import portalData from "@/services/portalData.json";


function SliceViewer() {
  const params = useParams();

  const [elements, setElements] = useState([]);
  const [slice, setSlice] = useState({
    "graph_id": "",
    "lease_end_time": "",
    "slice_id": "",
    "model": "",
    "name": "Slice Viewer",
    "state": "StableOK"
  });
  const [errors, setErrors] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [positionAddNode, setPositionAddNode] = useState({ x: 100, y: 600 });
  const [leaseStartTime, setLeaseStartTime] = useState("");
  const [leaseEndTime, setLeaseEndTime] = useState("");
  const [hasProject, setHasProject] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");
  const [ephemeralKey, setEphemeralKey] = useState({});

  useEffect(() => {
    const fetchSlice = async () => {
      setShowSpinner(true);
      setSpinnerText("Loading slice...");
      try {
        const { data: res } = await getSliceById(params.id);
        setElements(sliceParser(res.data[0]["model"]));
        setSlice(res.data[0]);
        setLeaseStartTime(res.data[0].lease_start_time);
        setLeaseEndTime(res.data[0].lease_end_time);
        setErrors(sliceErrorParser(res.data[0]["model"]));
        setShowSpinner(false);
        setSpinnerText("");
      } catch (err) {
        toast.error("User's credential is expired. Please re-login.");
        setShowSpinner(false);
        setSpinnerText("");
      }
    };
    fetchSlice();
  }, [params.id]);

  const generateEphemeralKey = async () => {
    const sliverId = selectedData && selectedData.properties && selectedData.properties.sliverId;
    try {
      // step 1: generate ephemeral key
      const { data: res } = await generateKeyPairs("sliver", `ephemeral-key-${sliverId}`,
      `ephemeral key to web ssh, sliver ${sliverId}`, false);
      setEphemeralKey(res.results[0]);
      // step 2: install ephemeral key to the sliver
      await installEphemeralKey(sliverId, res.results[0].public_openssh);
    } catch (err) {
      toast.error("Failed to generate and install ephemeral key. Please try again or input your key.")
    }
  };

  const handleDeleteSlice = async (id) => {
    setShowSpinner(true);
    setSpinnerText("Deleting Slice");
    try {
      await deleteSlice(id);
      // toast message to users when the api call is successfully done.
      toast.success("Slice deleted successfully.");
      await sleep(1000);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete the slice.");
    }
  };

  const handleNodeSelect = (data) => {
    setSelectedData(data);
  };

  const clearSelectedData = () => {
    setSelectedData(null);
  };

  const handleSaveJSON = () => {
    var jsonBlob = new Blob([ JSON.stringify(slice) ], { type: 'application/javascript;charset=utf-8' });
    saveAs( jsonBlob, `${slice.name}.json` );
  };

  const handleLeaseEndChange = (value) => {
    const inputTime = moment(value).format();
    // input format e.g. 2022-05-25T10:49:03-04:00
    // output format should be 2022-05-25 10:49:03 -0400
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");
    setLeaseEndTime(outputTime);
  };

  const handleSliceExtend = async () => {
    setShowSpinner(true);
    setSpinnerText("Extending slice...");
    try {
      await extendSlice(slice.slice_id, leaseEndTime);
      // toast message to users when the api call is successfully done.
      toast.success("Slice has been successfully renewed.");
      await sleep(1000);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to renew the slice.");
      setLeaseEndTime(slice.lease_end_time);
      setShowSpinner(false);
      setSpinnerText("");
    }
  };

  const stateColors = {
    "Nascent": "primary-dark",
    "StableOK": "success",
    "StableError": "warning",
    "AllocatedOK": "success",
    "AllocatedError": "warning",
    "Closing": "secondary",
    "Dead": "secondary",
    "Configuring": "primary",
    "Modifying": "primary",
    "ModifyError": "warning",
    "ModifyOK": "success"
  };

  let showSlice = !showSpinner && hasProject;

  return(
    <SliceViewerErrorBoundary
      slice={slice}
      leaseStartTime={leaseStartTime}
      leaseEndTime={leaseEndTime}
      onLeaseEndChange={handleLeaseEndChange}
      onSliceExtend={handleSliceExtend}
    >
      <div className="slice-page-container">
        <TerminalFormModal
          data={selectedData}
          ephemeralKey={ephemeralKey}
          onGenerateEphemeralKey={generateEphemeralKey}
        />
        {
          showSpinner &&
          <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
            <SpinnerWithText text={spinnerText} />
          </div>
        }
        {
          showSlice &&
          <div className="mx-5 mb-4 slice-viewer-container">
            <div className="d-flex flex-row justify-content-between align-items-center mt-2">
              <div className="d-flex flex-row justify-content-between align-items-center">
                <h2 className="me-3">
                  <b>{slice.name}</b>
                  <span className={`badge bg-${stateColors[slice.state]} ms-2`}>
                    {slice.state}
                  </span>
                  <a
                    href={portalData.learnArticles.guideToSliceBuilderSections["states"]}
                    target="_blank"
                    rel="noreferrer"
                    className="ms-1"
                  >
                    <HelpCircle size={16} className="ms-1" />
                  </a>
                </h2>
              </div>
              <div className="d-flex flex-row justify-content-between align-items-center">
                  {/* <Link href={`/slice-editor/${slice.slice_id}/${slice.project_id}`}>
                    <button
                      className="btn btn-sm btn-outline-primary my-3 me-3"
                    >
                      <ArrowLeftRight size={14} className="me-2" />
                      Edit Mode
                    </button>
                  </Link> */}
                {
                  ["StableOK", "ModifyOK", "StableError", "ModifyError", "AllocatedOK", " AllocatedError"].includes(slice.state) &&
                  <DeleteModal
                    name={"Delete Slice"}
                    text={'Are you sure you want to delete this slice? This process cannot be undone but you can find deleted slices by checking the "Include Dead Slices" radio button on Experiments -> Slices page.'}
                    id={"delete-a-slice"}
                    onDelete={() => handleDeleteSlice(slice.slice_id)}
                  />
                }
                <Link href="/experiments/slices">
                  <button
                    className="btn btn-sm btn-outline-primary my-3 ms-3"
                  >
                    <LogIn size={14} className="me-2" />
                    Back to Slice List
                  </button>
                </Link>
              </div>
            </div>
            {
              ["Configuring", "Modifying"].includes(slice.state)  &&
              <CountdownTimer
                text={"This slice is provisioning now."}
                interval={30}
              />
            }
            {
              (["Closing", "Dead", "StableError", "ModifyError"].includes(slice.state)
              && errors.length > 0) &&
              <ErrorMessageAccordion
                state={slice.state}
                errors={errors}
              />
            }
            <div className="d-flex flex-row justify-content-center">
              {
                elements.length > 0 &&
                <Graph
                  className="align-self-end"
                  isNewSlice={false}
                  elements={elements}
                  sliceName={slice.name}
                  defaultSize={{"width": 0.62, "height": 0.75, "zoom": 1}}
                  onNodeSelect={handleNodeSelect}
                  onSaveJSON={handleSaveJSON}
                />
              }
              {
                elements.length > 0 &&
                <div style={{ minWidth: "280px", maxWidth: "320px", width: "100%" }}>
                <DetailForm
                  slice={slice}
                  leaseStartTime={leaseStartTime}
                  leaseEndTime={leaseEndTime}
                  data={selectedData}
                  key={selectedData && selectedData.properties &&
                    `${selectedData.properties.class}-${selectedData.properties.name}`}
                  clearSelectedData={() => clearSelectedData()}
                  onLeaseEndChange={handleLeaseEndChange}
                  onSliceExtend={handleSliceExtend}
                />
                </div>
              }
            </div>
          </div>
        }
        </div>
    </SliceViewerErrorBoundary>
  )
}

export default SliceViewer;
