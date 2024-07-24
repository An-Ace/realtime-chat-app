'use client'
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown"
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import axios from "axios";
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { create } from 'zustand'
import { apiUrl, socketUrl } from "../var";
const socket = io(socketUrl);
type Order = { _id?: string, image: string, name: string, timmer: number, sellerNotification?: 'EXPIRED' | 'ACCEPTED', playOn?: number, acceptedOn?: number }

type Store = {
  orders: Order[]
  setOrders: (orders: Order[]) => void,
  updateOrder: (order: Order) => void,
  modals: Order[],
  setModals: (products: Order[]) => void
}

const useStore = create<Store>((set, value) => ({
  modals: [],
  setModals: (modals) => set((state) => ({ modals })),
  orders: [],
  setOrders: (orders) => set((state) => ({ orders })),
  updateOrder: (order: Order) => {
    const index = value().orders.findIndex(p => order._id === p._id)
    value().orders[index].playOn = order.playOn
    set((state) => ({ orders: value().orders }))
  }
}))
export default function Seller () {
  const router = useRouter()
  const [connected, setConnected] = useState<boolean>(false)
  const { orders, setOrders, updateOrder, modals, setModals } = useStore()
  const handleClose = async () => {
    // update null all
    await axios.post(`${apiUrl}/notification`, {
      role: localStorage.getItem('status'),
      ids: modals.map(modal => (modal._id))
    })
    setModals([])
  }
  useEffect(() => {
    const status = localStorage.getItem('status')
    if (status === 'SELLER') router.replace('/test/seller')
    if (!connected) {
      axios.get(`${apiUrl}/products`)
      .then(e => {
        setOrders(e.data)
        const listModal = e.data.filter((modal: Order) => (modal.sellerNotification))
        setModals(listModal)
      })
      socket.emit("SUBSCRIBE")
      socket.on("EXPIRED", (message) => {
        updateOrder(message)
        const listModal = message.sellerNotification ? [message] : []
        setModals(listModal)
      })
      socket.on("ACCEPTED", (message) => {
        updateOrder(message)
        const listModal = message.sellerNotification ? [message] : []
        setModals(listModal)
      })
      socket.on("PLAYED", (message) => {
        updateOrder(message)
      })
      
      setConnected(true)
    }
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [orders, connected])
  return <>
  {/* component */}
  <div className="flex min-h-screen items-center justify-center">
    <div className="overflow-x-auto">
      <div className="flex font-semibold text-lg justify-between">Order
      <button className="text-base font-normal" onClick={() => router.push('/test/seller/add')}>Add</button>
      <button className="text-base font-normal" onClick={() => {
          localStorage.removeItem('status')
          router.replace('/test')
        }}>Logout</button>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-xl">
        <thead>
          <tr className="bg-blue-gray-100 text-gray-700">
            <th className="py-3 px-4 text-left">Image</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Timmer</th>
            <th className="py-3 px-4 text-left">Countdown</th>
            <th className="py-3 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-blue-gray-900">
          {
            orders.map((order, i) => <tr key={order._id} className="border-b border-blue-gray-200">
              <td className="py-3 px-4"><img src={order.image} className="w-10" alt="" /></td>
              <td className="py-3 px-4">{order.name}</td>
              <td className="py-3 px-4">{order.timmer}</td>
              <td className="py-3 px-4">
              
              {
                order.playOn ? (order.timmer * 1000 + order.playOn) >= Date.now() ? <FlipClockCountdown
                  to={order.playOn + (order.timmer * 1000)}
                  renderOnServer
                  renderMap={[false, false, true, true]}
                /> : <>Expired</> : <>-</>
              }
            </td>
              <td className="py-3 px-4">
                <button
                  disabled={!Boolean(order.playOn)}
                  onClick={async () => {
                    socket.emit("ACCEPT", order)
                  }}
                  className="font-medium text-blue-600 hover:text-blue-800 disabled:text-blue-100"
                >
                  Accept
                </button>
              </td>
            </tr>)
          }
        </tbody>
      </table>
      {
        modals.length ? modals.map((modal) => <div key={ modal._id!+modal.sellerNotification } className="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
        <div className="bg-white px-16 pt-8 pb-6 rounded-md text-center">
          {
            <h1 className="text-xl mb-4 font-bold text-slate-500">
              { modal.name }
              <span className={`text-${modal.sellerNotification === 'EXPIRED' ? 'red' : 'green'}-500`}> {modal.sellerNotification}</span>
            </h1>
          }
          <button onClick={handleClose} className="bg-indigo-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold">
            Close
          </button>
        </div>
      </div>) : <></>
      }
    </div>
  </div>
</>

}