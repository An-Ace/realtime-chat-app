export function Me ({ message, name, status } : { message: string, name: string, status: 'SENDING' | 'SENT' | 'RECEIVED' }) {
  return <div className="chat-message">
    <div className="flex items-end justify-end">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
        <p className="font-semibold">You</p>
        <div>
          <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
            {message}
          </span>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
        alt="My profile"
        className="w-6 h-6 rounded-full order-2"
      />
      <p className="text-sm">{status}</p>

    </div>
  </div>
}

export function Other ({ message, name } : { message: string, name: string }) {
  return <div className="chat-message">
    <div className="flex items-end">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        <p className="text-semibold">{name}</p>
        <div>
          <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
            {message}
          </span>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
        alt="My profile"
        className="w-6 h-6 rounded-full order-1"
      />
    </div>
  </div>
}