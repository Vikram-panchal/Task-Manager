import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/dashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import apiService from "../../utils/apiServices";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/cards/TaskCard";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await apiService.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: { status: filterStatus === "All" ? "" : filterStatus },
      });

      setAllTasks(
        response?.data?.tasks?.length > 0 ? response?.data?.tasks : []
      );

      const statusSummary = response?.data?.statusSummary || {};
      console.log(statusSummary);
      const statusArray = [
        {
          label: "All",
          count: statusSummary?.all || 0,
        },
        {
          label: "Pending",
          count: statusSummary?.pendingTasks || 0,
        },
        {
          label: "In Progress",
          count: statusSummary?.inProgressTasks || 0,
        },
        {
          label: "Completed",
          count: statusSummary?.completedTasks || 0,
        },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  useEffect(() => {
    getAllTasks();
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border border-gray-100 shadow-sm shadow-gray-100 px-5 py-2 bg-white rounded-lg">
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
          {tabs?.[0]?.count > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>
        {allTasks?.length === 0 && (
          <p className="text-sm text-center p-10 text-gray-500">
            No Tasks Found
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item, index) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              status={item.status}
              priority={item.priority}
              progress={item.progress}
              dueDate={item.dueDate}
              createdAt={item.createdAt}
              assignedTo={item.assignedTo?.map((user) => user.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoCheckList={item.todoCheckList || []}
              onClick={() => handleClick(item._id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
