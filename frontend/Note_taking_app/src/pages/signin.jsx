import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import eye from "@iconify/icons-mdi/eye";
import eyeOff from "@iconify/icons-mdi/eye-off";
import { signinUser,clearError } from '../features/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';


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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const {token} = useSelector((state) => state.user);
  const [isvisible, setIsVisible] = useState(false);
  const error = useSelector(state => state.user?.error);
  const [sessionExpired, setSessionExpired] = useState(false);
  const[localerror,setLocalerror]=useState("")


  useEffect(() => {
    if (searchParams.get('message') === 'session_expired') {
      setSessionExpired(true);
      navigate('/signin', { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() =>{
    const token = document.cookie
  const match = token.match(/token=([^;]+)/);
    if (match){
      navigate('/dashboard')
    }

  },[])

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLocalerror(""); 
    if (!email || !password) {
      return setLocalerror("All fields are required.");
    }
    const result = await dispatch(signinUser({ email, password }));
  
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    } else if (result.meta.requestStatus === "rejected") {
      // Show error if login failed
      const message = result.payload?.message || "Invalid email or password";
      setLocalerror(message);
    }
  };
  

  const toggleeye = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>
        

        {sessionExpired && (
          <div className="mb-4 p-3 bg-orange-100 text-orange-800 rounded-lg text-sm">
            Your session has expired. Please login again.
          </div>
        )}
        
     
        {localerror && (
          <p className="text-red-500 bg-red-100 text-sm p-2 mb-4 rounded-lg">{localerror}</p>
        )}
        
        <form onSubmit={handleSignIn}>
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)

            }
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={isvisible ? "text" : "password"}
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)
                  }
                required
                className="w-full px-4 py-2 border rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button 
                type="button" 
                onClick={toggleeye}
                className="absolute top-2.5 right-3 text-gray-500 hover:text-gray-700"
              >
                <Icon icon={isvisible ? eye : eyeOff} size={25} />
              </button>
            </div>
          </div>
          
          <button
  type="submit"
  className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
>
Sign in
</button>
        </form>
        
        <p className="mt-4 text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <Link to="/" className="text-orange-500 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
