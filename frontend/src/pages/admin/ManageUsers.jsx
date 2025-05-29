import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/dashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import apiService from "../../utils/apiServices";
import UserCard from "../../components/cards/UserCard";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAlluser = async () => {
    try {
      const res = await apiService.get(API_PATHS.USERS.GET_ALL_USERS);
      if (res?.data?.length > 0) {
        setAllUsers(res.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    getAlluser();
    return () => {};
  }, []);
console.log(allUsers);
  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <h2 className="text-xl md:text-xl font-medium">Team Members</h2>
        {allUsers?.length === 0 && <p className="text-sm text-center p-10 text-gray-500">No team members found</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {
            allUsers?.map((user) => (
                <UserCard key={user._id} userInfo={user} />
            ))
        }
        </div>
      </div>

    </DashboardLayout>
  );
};

export default ManageUsers;
