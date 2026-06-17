import { useMemo } from "react";
import PipelineHeader from "../components/Pipeline/PipelineHeader";
import PipelineColumn from "../components/Pipeline/PipelineColumn";
import usePipeline from "../hooks/queries/usePipeline";

export default function Pipeline() {
  const { data: columns = {}, isLoading, isError } = usePipeline();
  //  const { data, isLoading, isError } = usePipeline();


  //   const columns = data?.columns || {};
  // const apiStats = data?.stats || {};


  const stats = useMemo(() => {
    let totalCompanies = 0;
    Object.values(columns).forEach((companies) => {
      totalCompanies += companies?.length || 0;
    });

    return {     //hardcoded meetingsBooked and pipelineGenerated for now, can be enhanced to pull dynamic metrics if available from API
      totalCompanies,
      meetingsBooked: 23, // Add logic to pull dynamic metrics if available from API
      pipelineGenerated: "$2.3M", 
    };
  }, [columns]);


  //    return {
  //     totalCompanies,
  //     meetingsBooked: apiStats.meetingsBooked || 0,
  //     pipelineGenerated: apiStats.pipelineGenerated || "$0",
  //   };
  // }, [columns, apiStats]);

  if (isLoading) {
    return <div className="text-white text-xl flex justify-center items-center h-64">Loading Pipeline...</div>;
  }

  if (isError) {
    return <div className="text-red-400 text-xl flex justify-center items-center h-64">Failed to load pipeline data. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <PipelineHeader stats={stats} />

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {Object.entries(columns).map(([stage, companies]) => (
            <PipelineColumn key={stage} stage={stage} companies={companies} />
          ))}
        </div>
      </div>
    </div>
  );
}


