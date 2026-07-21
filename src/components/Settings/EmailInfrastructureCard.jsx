export default function EmailInfrastructureCard({
  emailInfrastructure,
}) {
  return (
    <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">
        📧 Email Infrastructure
      </h2>
 
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>SendGrid Connected</span>
 
          <span className="text-green-400 font-bold">
            {emailInfrastructure?.sendGridConnected}
          </span>
        </div>
 
        <div className="flex justify-between">
          <span>Domain Warming</span>
 
          <span className="text-cyan-400 font-bold">
            {emailInfrastructure?.domainWarming}
          </span>
        </div>
 
        <div className="flex justify-between">
          <span>Daily Send Limit</span>
 
          <span className="text-green-400 font-bold">
            {emailInfrastructure?.dailySendLimit}
          </span>
        </div>
      </div>
 
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Email Health Score</span>
 
          <span className="text-green-400">
            {emailInfrastructure?.healthScore}%
          </span>
        </div>
 
        <div className="h-3 bg-[#24304A] rounded-full overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            style={{
              width: `${
                emailInfrastructure?.healthScore || 0
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}