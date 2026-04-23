"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const hashToPath = {
  "#profile": "/user/profile",
  "#roles": "/user/roles",
  "#sshKeys": "/user/ssh-keys",
  "#slices": "/user/slices",
  "#artifacts": "/user/artifacts",
};

export default function UserRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const path = hashToPath[hash] || "/user/profile";
    router.replace(path);
  }, [router]);

  return null;
}
