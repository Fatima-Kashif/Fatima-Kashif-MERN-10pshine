import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import eye from "@iconify/icons-mdi/eye";
import eyeOff from "@iconify/icons-mdi/eye-off";

const Input = ({ label, type, value, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );

  const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isvisible, setIsVisible] = useState(false);
    const [error, setError] = useState("");
  
    const handleSignIn = async (e) => {
      e.preventDefault();
      if (!email || !password) {
        setError("All fields are required.");
        return;
      }
      const userData={
        name,email,password
      }
      try{
        const res=await fetch("http://localhost:5173/user/signin",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(userData),
        });
        if (res.ok){
          setError("");
          navigate("/home");
        }
        else {
          const errorData = await res.json();
          setError(errorData.message || "Signin failed.");
        }
      }
      catch (err) {
        setError("Something went wrong.");
        console.error(err);
      }
    };
  
    const toggleeye = () => {
      setIsVisible((prev) => !prev);
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>
          {error && (
          <p className="text-red-500 bg-red-300 text-sm p-2 mb-4">{error}</p>
        )}
          <form action="">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {/* <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={isvisible ? "text" : "password"}
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <button type="button" onClick={toggleeye}>
                <Icon
                  className="absolute top-2.5 right-3"
                  icon={isvisible ? eye : eyeOff}
                  size={25}
                />
              </button>
            </div>
          </div>
          </form>
          <button onClick={handleSignIn} className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold hover:bg-orange-600">Sign in</button>
          <p className="mt-4 text-sm text-center text-gray-500">
            Don’t have an account? <Link to="/" className="text-orange-500 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    );
  };
 export default SignIn;