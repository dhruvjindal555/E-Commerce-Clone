import React, { useState, useEffect, useContext } from 'react'
import AuthContext from './AuthContext'
import LoadingContext from '../LoadingContext/LoadingContext'

function AuthState(props) {
  const { loading, setLoading } = useContext(LoadingContext)
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })
  const [userDetails, setUserDetails] = useState({})
  const handleLogIn = async () => {
    setLoading(true)
    const response = await fetch("https://apni-dukaan-3555.onrender.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    })
    const data = await response.json()
    setLoading(false)
    const { success, message, authToken } = data
    if (success) {
      window.localStorage.setItem("authToken", authToken)
      const data = await fetchUserDetails()
      console.log("data",data);      
      setCredentials({
        email: "",
        password: ""
      })
      console.log(message);
    }
    console.log(message);
    return data
  };
  const handleSignUp = async () => {
    if (credentials.password === credentials.confirmPassword) {
      setLoading(true)
      const response = await fetch("https://apni-dukaan-3555.onrender.com/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      })
      const data = await response.json()
      setLoading(false)
      const { success, message } = data
      if (success) {
        console.log(message);
        setCredentials({
          email: "",
          password: ""
        })
      } else {
        console.log(message);
      }
      return data
    } else {
      return { 'success': false, 'message': 'Passwords are not matching!' }
    }
  }
  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://apni-dukaan-3555.onrender.com/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authToken': window.localStorage.getItem('authToken')
        }
      });

      if (!response.ok) {
        setLoading(false)
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setLoading(false)
      setUserDetails(data.user);
      // console.log(data);      
      if (data.success) {
        return data.user;
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };


  const updateUserDetails = async (userData) => {
    try {
      setLoading(true)
      const response = await fetch('https://apni-dukaan-3555.onrender.com/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authToken': window.localStorage.getItem('authToken')
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          address: {
            street: userData.address.street,
            city: userData.address.city,
            state: userData.address.state || '', // Optional
            pinCode: userData.address.pinCode,
            country: userData.address.country
          },
          profileUrl: userData.profileUrl || '' // Optional
        })
      });

      const responseData = await response.json(); // Always parse the response first
      setLoading(false)
      console.log(responseData);
      if (!response.ok) {
        throw new Error(responseData.message || 'Update failed'); // Throw an error with the server message
      }

      return responseData;
    } catch (error) {
      console.error('Error updating user details:', error);
      if (error.errors && Array.isArray(error.errors)) {
        throw error.errors[0];
      } else {
        throw error; // Re-throw the error so that handleSubmit can process it
      }
    }
  };
  const updateUserByAdmin = async (userData) => {
    try {
      setLoading(true)
      const response = await fetch(`https://apni-dukaan-3555.onrender.com/user/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authToken': window.localStorage.getItem('authToken')
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          address: {
            street: userData.address.street,
            city: userData.address.city,
            state: userData.address.state || '', // Optional
            pinCode: userData.address.pinCode,
            country: userData.address.country
          },
          profileUrl: userData.profileUrl || '' // Optional
        })
      });

      const responseData = await response.json(); // Always parse the response first
      setLoading(false)
      console.log(responseData);
      if (!response.ok) {
        throw new Error(responseData.message || 'Update failed'); // Throw an error with the server message
      }

      return responseData;
    } catch (error) {
      console.error('Error updating user details:', error);
      if (error.errors && Array.isArray(error.errors)) {
        throw error.errors[0];
      } else {
        throw error; // Re-throw the error so that handleSubmit can process it
      }
    }
  };
  const deleteUserByAdmin = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`https://apni-dukaan-3555.onrender.com/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authToken': window.localStorage.getItem('authToken')
        }
      });

      if (!response.ok) {
        setLoading(false)
        throw new Error('Failed to delete user');
      }

      await response.json();
      setLoading(false)
      // console.log(data);      

    } catch (error) {
      console.error('Error deleting user details:', error);
      throw new Error(error.message)
    }
  };
  useEffect(() => {
    // Es lint-disable-next-line
    fetchUserDetails()
  }, [])


  return (
    <AuthContext.Provider value={{
      loading,
      setLoading,
      userDetails,
      setUserDetails,
      credentials,
      setCredentials,
      handleLogIn,
      handleSignUp,
      fetchUserDetails,
      updateUserDetails,
      updateUserByAdmin,
      deleteUserByAdmin
    }} >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState
