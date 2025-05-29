
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/authLayout";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import apiService from "../../utils/apiServices";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await apiService.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen mt-10 md:mt-0 flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 md:p-10 w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h3>
        <p className="text-sm text-center text-gray-600 mt-2 mb-6">
          Please login to your account
        </p>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="Vikram@gmail.com"
            type="text"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Pass@123"
            type="password"
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white font-medium transition-colors ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Login"}
          </button>

          <p className="text-sm text-gray-700 text-center">
            Don't have an account?{" "}
            <Link className="text-blue-600 hover:underline font-medium" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;


const Spinner = () => (
  <div className="flex justify-center items-center gap-2">
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    Logging in...
  </div>
);