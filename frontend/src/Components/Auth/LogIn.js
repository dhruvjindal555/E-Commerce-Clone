import React, { useState } from 'react'
import {
  Link,
  useNavigate
} from "react-router-dom";

function LogIn() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })

  const onChange = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8888/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    })
    const data = await response.json()
    const { success, message, authToken } = data
    if (success) {
      localStorage.setItem("authToken", authToken)
      console.log(message);
      navigate('/')

    } else {
      console.log(message);
    }
  }
  return (
    <>
      <div>
        <section className=" mt-12 ">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">

            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input
                      onChange={onChange}
                      value={credentials.email} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input
                      onChange={onChange} type="password" name="password" id="password"
                      value={credentials.password} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                  </div>
                  <button type="submit" className="dark:hover:border-gray-300 hover:border-black dark:border-2 dark:border-gray-500 border-2 w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 dark:text-white">Sign in</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don't have an account yet? <Link to="/auth/signup" className=" font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default LogIn