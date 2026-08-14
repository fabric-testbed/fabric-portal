"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import portalData from "@/services/portalData.json";

export default function useSessionTimeout() {
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const timer1Ref = useRef(null);
  const timer2Ref = useRef(null);

  const startTimers = useCallback(() => {
    // 5 minutes before cookie expires
    timer1Ref.current = setTimeout(() => {
      setShowModal1(true);
    }, portalData["5minBeforeCookieExpires"]);

    // 1 minute before cookie expires
    timer2Ref.current = setTimeout(() => {
      setShowModal1(false);
      setShowModal2(true);
    }, portalData["1minBeforeCookieExpires"]);
  }, []);

  const clearTimers = useCallback(() => {
    if (timer1Ref.current) {
      clearTimeout(timer1Ref.current);
      timer1Ref.current = null;
    }
    if (timer2Ref.current) {
      clearTimeout(timer2Ref.current);
      timer2Ref.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  return { showModal1, showModal2, startTimers, clearTimers };
}
