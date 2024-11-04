"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ClientOnlyComponent = dynamic(() => import("@/components/ClientOnlyComponent"), {
  ssr: false,
});

const ScriptPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient && <ClientOnlyComponent />}
    </div>
  )
};

export default ScriptPage;