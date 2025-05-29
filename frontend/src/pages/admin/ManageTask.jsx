import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/dashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import apiService from "../../utils/apiServices";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/cards/TaskCard";

const ManageTask = () => {
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

  const handleClick = (taskData) => {
    navigate("/admin/create-task", { state: { taskId: taskData._id } });
  };

  useEffect(() => {
    getAllTasks();
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu={"Manage Task"}>
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border border-gray-100 shadow-sm shadow-gray-100 px-5 py-2 bg-white rounded-lg">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
          </div>
          {tabs?.[0]?.count > 0 ? (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            </div>
          ) : (
            <div className="flex text-center justify-center py-4 text-gray-500 text-sm">No Task Found</div>
          )}
        </div>
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
              onClick={() => handleClick(item)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTask;
