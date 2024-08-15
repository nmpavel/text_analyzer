import ApiService from '@/utils/apiCore';
import React, { useEffect, useState } from 'react'

const AdminDashboard = () => {
    const [texts,setTexts]=useState<any[]>([]);
    const apiService = new ApiService ();
    useEffect(()=>{
        fetchTexts();
    },[])
    const fetchTexts = async () => {
       try{
        const resp = await apiService.getData("text");
        if(resp.statusCode===200) setTexts(resp?.data)
       }catch (err){
        console.log(err)
       }
    }
  return (
    <div className=' bg-white p-6'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
        {
        texts.map((text:any)=>(
            <div className=' bg-gray-200 p-4 rounded-lg shadow-md'>
                <p className=' text-black'>{text?.content}</p>
            </div>
        ))
       }
        </div>
    </div>
  )
}

export default AdminDashboard