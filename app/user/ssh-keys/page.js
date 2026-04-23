"use client";

import KeyTabs from "@/components/SshKey/KeyTabs";
import { useUserPage } from "../UserContext";

export default function SshKeysPage() {
  const { sliverKeys, bastionKeys } = useUserPage();
  return (
    <KeyTabs
      sliverKeys={sliverKeys}
      bastionKeys={bastionKeys}
      disableKeyDelete={true}
    />
  );
}
