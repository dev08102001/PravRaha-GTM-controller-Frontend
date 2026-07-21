export default function TeamAccessCard({
  teamMembers,
}) {
  return (
    <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">
        👥 Team & Access
      </h2>
 
      <div className="space-y-5">
        {teamMembers?.map((member) => (
          <div
            key={member._id}
            className="flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">
                {member.name}
              </h3>
 
              <p className="text-gray-400">
                {member.email}
              </p>
            </div>
 
            <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold">
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
 