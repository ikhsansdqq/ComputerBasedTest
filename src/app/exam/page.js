import dynamic from "next/dynamic";

const ClientOnlyComponent = dynamic(() => import("@/components/ClientOnlyComponent"), {
  ssr: true,
});

const ScriptPage = () => {
  return (
    <div>
      <ClientOnlyComponent />;
    </div>
  )
};

export default ScriptPage;