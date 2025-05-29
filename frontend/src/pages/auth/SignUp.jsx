// import React, { useContext, useState } from "react";
// import AuthLayout from "../../components/layouts/authLayout";
// import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
// import Input from "../../components/inputs/Input";
// import { Link, Navigate } from "react-router-dom";
// import { validateEmail } from "../../utils/helper";
// import { API_PATHS } from "../../utils/apiPaths";
// import apiService from "../../utils/apiServices";
// import { UserContext } from "../../context/userContext";
// import uploadeImage from "../../utils/uploadImage";

// const SignUp = () => {
//   const [profileImage, setProfileImage] = useState(null);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [adminInviteToken, setAdminInviteToken] = useState("");

//   const [error, setError] = useState(null);
//   const { updateUser } = useContext(UserContext);

//   const handleSignupSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!fullName) {
//       setError("Please enter name");
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }
//     if (!password) {
//       setError("Please enter the password.");
//       return;
//     }
//     if(!profileImage) {
//       setError("Please select a profile image.");
//       return;
//     }
//     if (!adminInviteToken) {
//       setError("Please enter the invite code.");
//       return;
//     }

//     setError("");

//     try {

//       const response = await apiService.post(API_PATHS.AUTH.REGISTER, {
//         name: fullName,
//         email,
//         password,
//         profileImageUrl: profileImage,
//         adminInviteToken,
//       });

//       const { token, role } = response.data;
//       if (token) {
//         localStorage.setItem("token", token);
//         updateUser(response.data);
//         // redirect
//         window.location.href = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
//       } else {
//         setError("Unexpected response. Please try again.");
//       }

//     } catch (error) {
//       console.error("Signup Error:", error);
//       if (error.response?.data?.message) {
//         setError(error.response.data.message);
//       } else {
//         setError("Something went wrong.");
//       }
//     }
//   };

//   return (
//     <>
//       <div className="w-full h-screen mt-10 md:mt-0 flex flex-col items-center justify-center">
//         <h3 className="text-xl font-semibold text-black">Create an Account</h3>
//         <p className="text-xs text-state-700 mt-[5px] mb-6">
//           Join us today by entering your details below.
//         </p>

//         <form onSubmit={handleSignupSubmit}>
//           <ProfilePhotoSelector
//             image={profileImage}
//             setImage={setProfileImage}
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               label="Full Name"
//               placeholder="Vikram Panchal"
//               type="text"
//             />

//             <Input
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               label="Email Address"
//               placeholder="Vikram@gmail.com"
//               type="text"
//             />

//             <Input
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               label="Password"
//               placeholder="Pass@123"
//               type="password"
//             />
//             {/* <Input
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               label="Confirm Password"
//               placeholder="Pass@123"
//               type="password"
//             /> */}

//             <Input
//               value={adminInviteToken}
//               onChange={(e) => setAdminInviteToken(e.target.value)}
//               label="Invite Code"
//               placeholder="6 Digit Code"
//               type="text"
//             />
//           </div>
//           {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

//           <button type="submit" className="btn-primary">
//             Sign Up
//           </button>

//           <p className="text-[13px] text-slate-800 mt-3">
//             Already have an account? {""}
//             <Link className=" font-medium text-blue-600 underline" to="/login">
//               Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </>
//   );
// };

// export default SignUp;

import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPaths";
import apiService from "../../utils/apiServices";
import { UserContext } from "../../context/userContext";

const SignUp = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useContext(UserContext);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName) return setError("Please enter your name.");
    if (!validateEmail(email))
      return setError("Please enter a valid email address.");
    if (!password) return setError("Please enter the password.");
    if (!profileImage) return setError("Please select a profile image.");
    if (!adminInviteToken) return setError("Please enter the invite code.");

    try {
      setLoading(true);

      const response = await apiService.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl: profileImage,
        adminInviteToken,
      });

      const { token, role } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        window.location.href =
          role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      } else {
        setError("Unexpected response. Please try again.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen mt-10 md:mt-0 flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-8 md:p-10 w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">
          Create an Account
        </h3>
        <p className="text-sm text-center text-gray-600 mt-2 mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignupSubmit} className="space-y-5">
          <ProfilePhotoSelector
            image={profileImage}
            setImage={setProfileImage}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              placeholder="Vikram Panchal"
              type="text"
            />

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="Vikram@gmail.com"
              type="email"
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Pass@123"
              type="password"
            />

            <Input
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
              label="Invite Code"
              placeholder="6 Digit Code"
              type="text"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white font-medium transition-colors ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Sign Up"}
          </button>

          <p className="text-sm text-gray-700 text-center">
            Already have an account?{" "}
            <Link
              className="text-blue-600 hover:underline font-medium"
              to="/login"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

const Spinner = () => (
  <div className="flex justify-center items-center gap-2">
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    Signing up...
  </div>
);
