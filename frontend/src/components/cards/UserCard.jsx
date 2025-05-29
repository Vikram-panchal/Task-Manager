import React from "react";

const UserCard = ({ userInfo }) => {
    // console.log(userInfo)
  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.profileImageUrl}
            alt="Avatar"
            className="w-12 h-12 rounded-full border-2 border-white"
          />

          <div>
            <p className="font-medium text-sm">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>
      <div className="flex items-end mt-5 gap-3">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {

     const getStatusTagColor = () => {
    switch (status) {
      case "Completed":
        return "text-lime-500 bg-lime-100 border border-lime-500/20";
      case "In Progress":
        return "text-indigo-500 bg-indigo-100 border border-indigo-500/10";
      default:
        return "text-violet-500 bg-violet-100 border border-violet-500/10";
    }
  };
  return (
    <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
      <span className="text-[12px] font-semibold">{count}</span><br />{label}
    </div>
  );
};