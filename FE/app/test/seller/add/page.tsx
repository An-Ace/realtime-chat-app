'use client'
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { apiUrl } from "../../var"
// import FileBase64 from 'react-file-base64';

export default function Add () {
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [timmer, setTimmer] = useState('')
  useEffect(() => {
    
  }, [])
  const handleSend = useCallback(async () => {
   await axios.post(`${apiUrl}/product`, { image, name, timmer: Number(timmer) })
   setImage('')
   setName('')
   setTimmer('')
  }, [image, name, timmer])
  return <>
    {/* component */}
    <div className="flex items-center justify-center p-12">
      {/* Author: FormBold Team */}
      {/* Learn More: https://formbold.com */}
      <div className="mx-auto w-full max-w-[550px]">
        <div>
          <div className="mb-5">
            <label
              htmlFor="image"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Image Url
            </label>
            <input
              type="text"
              name="image"
              id="image"
              placeholder="Image Url"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              onChange={e => setImage(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="timmer"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Timmer (Seconds)
            </label>
            <input
              type="number"
              name="timmer"
              id="timmer"
              placeholder="Timmer"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              onChange={e => setTimmer(e.target.value)}
            />
          </div>
          <div>
            <button onClick={handleSend} className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-base font-semibold text-white outline-none">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </>

  // return <div className="grid grid-cols-4 m-4" >
  //   {/* <FileBase64
  //     multiple={ false }
  //     accept="image/*"
  //     placeholder="image"
  //     onDone={e => setImage(e)} /> */}
  //   {/* <input type="file" placeholder="image"  onChange={e => setImage(e.target.value)}/> */}
  //   <input type="text" placeholder="image url" onChange={e => setImage(e.target.value)} value={name}/>
  //   <input type="text" placeholder="name" onChange={e => setName(e.target.value)} value={name}/>
  //   <input type="number" placeholder="timmer" onChange={e => setTimmer(e.target.value)} value={timmer}/>  
  //   <button onClick={handleSend}>Post</button>  
  // </div>
}