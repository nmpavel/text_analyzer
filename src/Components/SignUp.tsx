"use client";
import React, { useState } from "react";
import { UserModel } from "./LogIn";
import ApiService from "@/utils/apiCore";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [role, setRole] = useState<string>("");
  const [user ,setUser] = useState<UserModel>();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const apiService = new ApiService();
  const router = useRouter();
  
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleChange = ({ target: { name, value } }: any) =>
    setUser((prev: any) => ({ ...prev, [name]: value }));

  const validateForm = (data: any) => {
    setShowLoader(true);
    try {
      const requiredFields = ['userName', 'password', 'role'];
      for (const field of requiredFields) {
        if (!data || !data[field]) {
          alert(`Please Enter ${field}.`);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error in validateForm:', error);
      return false;
    } finally {
      setShowLoader(false);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
      const data:UserModel = {
         userName: user?.userName,
         password: user?.password,
         role: role
      };
      if (!validateForm(data)) {
        return;
      }
      try {
        const response = await apiService.postData('auth/signup',data);
        if (response?.statusCode === 201) {
          localStorage.setItem('token', response?.data?.access_token)
          localStorage.setItem('role', response?.data?.role)
          router.push("/dashboard")
        } 
      } catch (e: any) {
        alert('Something went wrong!');
      } finally {
        setShowLoader(false);
      }  
  };

  return (
    <section className="lg:h-screen bg-gray-700 p-16 text-white">
      <div className="h-full">
        <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample image"
            />
          </div>
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <form onSubmit={handleSubmit}>
              <div className="relative mb-6" data-twe-input-wrapper-init>
              <input
                  type="text"
                  name="userName"
                  value={user?.userName}
                  onChange={handleChange}
                  className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-blue-700 data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white  [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                  placeholder="User Name"
                  required
                />
                <label className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-blue-700 peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none ">
                  User Name
                </label>
              </div>

              <div className="relative mb-6" data-twe-input-wrapper-init>
                <input
                  type="password"
                  name="password"
                  value={user?.password}
                  onChange={handleChange}
                  className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-blue-700 data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none  [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                  placeholder="Password"
                  required
                />
                <label className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-blue-700 peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-blue-700">
                  Password
                </label>
              </div>
              <div className="mb-8 text-black">
                <select
                  id="role"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={role}
                  onChange={handleSelectChange}
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="inline-block w-full rounded bg-blue-700 px-7 pb-2 pt-3 text-sm font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-blue-600 hover:shadow-md focus:bg-blue-600 focus:shadow-md focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-md "
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                >
                  Register
                </button>

                <p className="mb-0 mt-2 pt-1 text-sm font-semibold">
                  Already have an account?
                  <a
                    href="/"
                    className="text-red-400 transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700"
                  >
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
