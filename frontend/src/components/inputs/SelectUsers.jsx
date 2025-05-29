import React, { useEffect, useState } from "react";
import apiService from "../../utils/apiServices";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUser, LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const res = await apiService.get(API_PATHS.USERS.GET_ALL_USERS);

      if (res.data?.length > 0) {
        setAllUsers(res.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUsers.length > 0) {
      setTempSelectedUsers([]);
    }
    return () => {};
  }, [selectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 && (
        <button
          type="button"
          className="card-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <LuUsers className="text-sm" />
          Add Members
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer">
          <AvatarGroup setIsModalOpen={setIsModalOpen} avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal
        title="Select Users"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-200 "
            >
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.name}
                </p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>
              <input
                type="checkbox"
                onChange={() => toggleUserSelection(user._id)}
                checked={tempSelectedUsers.includes(user._id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm outline-none"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            className="card-btn"
            onClick={() => setIsModalOpen(false)}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="card-btn-fill"
            onClick={handleAssign}
          >
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
