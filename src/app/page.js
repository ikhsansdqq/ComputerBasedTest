import dynamic from "next/dynamic";

const ClientOnlyComponent = dynamic(() => import("@/components/ClientOnlyComponent"), {
  ssr: false,
});

const ScriptPage = () => {
  return <ClientOnlyComponent />;
};

export default ScriptPage;