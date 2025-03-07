'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Login () {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = () => {
    if (username === 'buyer' && password === 'buyer') {
      localStorage.setItem('status', 'BUYER')
      router.replace('/test/buyer')
    } else if (username === 'seller' && password === 'seller') {
      localStorage.setItem('status', 'SELLER')
      router.replace('/test/seller')
    }
  }
  useEffect(() => {
    const status = localStorage.getItem('status')
    if (status === 'BUYER') router.replace('/test/buyer')
    else if (status === 'SELLER') router.replace('/test/seller')
  }, [])
  return<>
    {/* component */}
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950 p-12">
      <div >
        <div className="max-w-sm rounded-3xl bg-gradient-to-b from-sky-300 to-purple-500 p-px dark:from-gray-800 dark:to-transparent">
          <div className="rounded-[calc(1.5rem-1px)] bg-white px-10 p-12 dark:bg-gray-900">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                Signin to your account
              </h1>
            </div>
            <div className="mt-8 space-y-8">
              <div className="space-y-6">
                <input
                  className="w-full bg-transparent text-gray-600 dark:text-white dark:border-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 dark:placeholder-gray-300"
                  placeholder="Your Username"
                  type="username"
                  name="username"
                  id="username"
                  onChange={e => setUsername(e.target.value)}
                />
                <input
                  className="w-full bg-transparent text-gray-600 dark:text-white dark:border-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 dark:placeholder-gray-300"
                  placeholder="Your Password"
                  type="password"
                  name="password"
                  id="password"
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button onClick={handleLogin} className="h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-700 transition duration-500 rounded-md text-white">
                Signin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>

}