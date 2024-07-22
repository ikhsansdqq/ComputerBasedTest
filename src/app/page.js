import dynamic from "next/dynamic";
import Link from "next/link";

import Navbar from "@/components/Navbar";

const ClientOnlyComponent = dynamic(() => import("@/components/ClientOnlyComponent"), {
  ssr: false,
});

const ScriptPage = () => {
  return (
    <div>
      <Navbar />
      <ClientOnlyComponent />;
    </div>
  )
};

export default ScriptPage;