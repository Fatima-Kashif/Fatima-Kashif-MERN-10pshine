import BASE_URL from '../../config'

export const signup = async (userData) => {
    const response = await fetch(`${BASE_URL}/user/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }
  
    return await response.json();
  };


  export const signin = async (userData) => {
    const response = await fetch(`${BASE_URL}/user/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid email or password');
    }
  
    return await response.json();
};

export const logout = async () => {
    const response = await fetch(`${BASE_URL}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  
    if (!response.ok) {
      throw new Error('Logout failed');
    }
  
    return await response.json();
  };