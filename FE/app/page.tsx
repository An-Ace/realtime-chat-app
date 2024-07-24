'use client'
import {useState } from 'react';
import Panel from './panel';

export default function Home() {
  const [name, setName] = useState('')
  const [input, setInput] = useState('')
  return (
    <main>
      {
        name ? <Panel name={name}/> : <div className="bg-white">
        {/* Flex container for centering items */}
          <div className="flex h-screen flex-col items-center justify-center">
            {/* Container for login form */}
            <div className="max-h-auto mx-auto max-w-xl">
              {/* Login title and description */}
              <div className="mb-8 space-y-3">
                <p className="text-xl font-semibold">Set Name</p>
              </div>
              {/* Login form */}
              <div className="w-full">
                <div className="mb-10 space-y-3">
                  <div className="space-y-1">
                    <div className="space-y-2">
                      {/* Email label and input field */}
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="name"
                        placeholder="Your Name"
                        name="name"
                        onChange={e => setInput(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    onClick={e => setName(input)}
                    className="ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </main>
  );
}
