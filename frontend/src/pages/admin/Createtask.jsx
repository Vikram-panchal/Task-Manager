import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/dashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import apiService from "../../utils/apiServices";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropDown from "../../components/inputs/SelectDropDown";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

const Createtask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    attachments: [],
    todoCheckList: [],
  });

  const [currentTask, setCurrentTask] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      attachments: [],
      todoCheckList: [],
    });
  };

  //create task
  const createTask = async () => {
    setLoading(true);

    try {
      const todoList = taskData.todoCheckList?.map((item) => ({
        text: item,
        completed: false,
      }));

      const res = await apiService.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: todoList,
      });

      toast.success("Task created successfully.");
      clearData();
    } catch (error) {
      console.error("Error creating task", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  //delete task
  const deleteTask = async () => {
    try {
      await apiService.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully.");
      navigate("/admin/tasks");
    } catch (error) {
      console.error(
        "Error deleting task",
        error?.response?.data?.message || error.message
      );
    }
  };

  //update task
  const updateTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoCheckList?.map((item) => {
        const prevTodoCheckList = currentTask?.todoCheckList || [];
        const matchedTask = prevTodoCheckList.find(
          (task) => task.text === item
        );

        return {
          text: item,
          completed: matchedTask ? matchedTask?.completed : false,
        };
      });

      const response = await apiService.put(
        API_PATHS.TASKS.UPDATE_TASK(currentTask._id),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoCheckList: todolist,
        }
      );
      toast.success("Task updated successfully.");
      clearData();
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error updating task", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  //get task details
  const getTaskDetailsById = async (taskId) => {
    try {
      const res = await apiService.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      if (res.data) {
        const taskInfo = res.data;
        setCurrentTask(taskInfo);
        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo.assignedTo?.map((user) => user._id) || [],
          todoCheckList:
            taskInfo.todoCheckList?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {
      console.error("Error getting task details", error);
    }
  };

  //handle submit
  const handleSubmit = async (e) => {
    setError(null);

    //Input Validation
    if (!taskData.title.trim()) {
      setError("Please enter  task title.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Please enter task description.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Please select due date.");
      return;
    }
    if (taskData.assignedTo.length === 0) {
      setError("Please select assigned to.");
      return;
    }
    if (taskData.todoCheckList?.length === 0) {
      setError("Please add atleast one task.");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId);
    }
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  type="button"
                  onClick={() => setOpenDeleteAlert(true)}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 px-2 py-1 rounded border border-rose-100 hover:bg-rose-300 cursor-pointer"
                >
                  <LuTrash2 className="text-base" /> Delete Task
                </button>
              )}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title ?? ""}
                onChange={(e) => handleValueChange("title", e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Task Description
              </label>
              <textarea
                placeholder="Describe task..."
                className="form-input"
                value={taskData.description ?? ""}
                onChange={(e) =>
                  handleValueChange("description", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropDown
                  options={PRIORITY_DATA}
                  placeholder="Select Priority"
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  type="date"
                  placeholder="Create App UI"
                  className="form-input"
                  value={taskData.dueDate ?? ""}
                  onChange={(e) => handleValueChange("dueDate", e.target.value)}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assigned To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO CheckList
              </label>

              <TodoListInput
                todoList={taskData.todoCheckList}
                setTodoList={(value) =>
                  handleValueChange("todoCheckList", value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>
            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-5">
              <button
                className="add-btn"
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Createtask;
