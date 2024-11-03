import dynamic from "next/dynamic";

const ClientOnlyComponent = dynamic(() => import("@/components/ClientOnlyComponent"), {
  ssr: false,
});

const ScriptPage = () => {
  return (
    <div>
      <ClientOnlyComponent />;
    </div>
  )
};

export default ScriptPage;