"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import portalData from "@/services/portalData.json";

export default function useSessionTimeout() {
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const interval1Ref = useRef(null);
  const interval2Ref = useRef(null);

  const startTimers = useCallback(() => {
    // 5 minutes before cookie expires
    interval1Ref.current = setInterval(() => {
      setShowModal1(true);
    }, portalData["5minBeforeCookieExpires"]);

    // 1 minute before cookie expires
    interval2Ref.current = setInterval(() => {
      setShowModal1(false);
      setShowModal2(true);
    }, portalData["1minBeforeCookieExpires"]);
  }, []);

  const clearTimers = useCallback(() => {
    if (interval1Ref.current) {
      clearInterval(interval1Ref.current);
      interval1Ref.current = null;
    }
    if (interval2Ref.current) {
      clearInterval(interval2Ref.current);
      interval2Ref.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  return { showModal1, showModal2, startTimers, clearTimers };
}
