export const getTagStyle = (tag) => {
  switch (tag?.toUpperCase()) {
    case "FUNDING":
      return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    case "HIRING":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "TECH":
    case "TECH CHANGE":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "EXEC MOVE":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "PRODUCT":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "ENTERPRISE":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};