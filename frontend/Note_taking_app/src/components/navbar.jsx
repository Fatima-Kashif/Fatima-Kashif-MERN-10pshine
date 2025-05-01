import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/user/userSlice';
import { useDispatch,useSelector } from 'react-redux';


const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/signin');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };


  return (
    <div className="bg-[#f8eee2] shadow-sm py-4 px-6 flex justify-between items-center">
   <div className="flex items-center space-x-4">
  <img src='../../assets/image.svg' alt="logo" className="w-8 h-10" />
  <h1 className="text-xl font-bold text-orange-500">Organotes</h1>
</div>
      
      <div className="flex items-center space-x-4">
       {user && <span className="text-gray-700">Welcome, {user.user.name}</span>}
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
        >
          Logout
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;