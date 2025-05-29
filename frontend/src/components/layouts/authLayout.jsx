import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div classsName="flex w-screen h-screen align-center justify-center md:w-[60vw] px-12 pb-12">
      <h2 className="text-lg font-medium text-black">Task Manager</h2>
      {children}
    </div>
  );
};

export default AuthLayout;
