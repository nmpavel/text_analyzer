'use client';
import AdminDashboard from '@/Components/dashboards/AdminDashboard';
import UserDashboard from '@/Components/dashboards/UserDashboard';
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
    const [role,setRole] = useState<string | null>("user");
    useEffect(()=>{
        const rol = typeof window !== 'undefined' ? localStorage.getItem('role') : '';
        setRole(rol);
    },[role])
  return (
    <>
    {
        role === "user" ? <UserDashboard/> : <AdminDashboard/>
    }
    </>
  )
}

export default Dashboard