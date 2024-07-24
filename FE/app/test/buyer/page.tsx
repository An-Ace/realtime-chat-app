'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { create } from 'zustand'
import { apiUrl, socketUrl } from '../var';
const socket = io(socketUrl);
type Product = { _id?: string, image: string, name: string, timmer: number, buyerNotification?: 'EXPIRED' | 'ACCEPTED', playOn?: number, acceptedOn?: number }

type Store = {
  modals: Product[]
  setModals: (products: Product[]) => void
  products: Product[]
  setProducts: (products: Product[]) => void
  updateProduct: (products: Product) => void
}

const useStore = create<Store>((set, value) => ({
  modals: [],
  setModals: (modals) => set((state) => ({ modals })),
  products: [],
  setProducts: (products) => set((state) => ({ products })),
  updateProduct: (product: Product) => {
    const index = value().products.findIndex(p => product._id === p._id)
    value().products[index].playOn = product.playOn
    set((state) => ({ products: value().products }))
  },
}))
export default function Buyer () {
  const router = useRouter()
  const [connected, setConnected] = useState<boolean>(false)
  const { products, setProducts, updateProduct, setModals, modals } = useStore()
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
        setProducts(e.data)
        // (modal.playOn && (modal.timmer * 1000 + modal.playOn) < Date.now()) || modal.acceptedOn)
        const listModal = e.data.filter((modal: Product) => (modal.buyerNotification))
        setModals(listModal)
      })
      socket.emit("SUBSCRIBE")
      socket.on("EXPIRED", (message) => {
        updateProduct(message)
        const listModal = message.buyerNotification ? [message] : []
        setModals(listModal)
      })
      socket.on("ACCEPTED", (message) => {
        updateProduct(message)
        console.log(message)
        const listModal = message.buyerNotification ? [message] : []
        setModals(listModal)
      })
      socket.on("PLAYED", (message) => {
        updateProduct(message)
      })
      setConnected(true)
    }
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [products, connected])
  return <div>
  {/* component */}
  <div className="flex min-h-screen items-center justify-center">
    <div className="overflow-x-auto">
      <div className="flex font-semibold text-lg justify-between">Order
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
            {/* <th className="py-3 px-4 text-left">Countdown</th> */}
            <th className="py-3 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-blue-gray-900">
          {
            products.map((product, i) => <tr className="border-b border-blue-gray-200" key={product._id!}>
              <td className="py-3 px-4"><img src={product.image} className="w-10" alt="" /></td>
              <td className="py-3 px-4">{product.name}</td>
              <td className="py-3 px-4">{product.timmer}</td>
              <td className="py-3 px-4">
                <button
                  disabled={Boolean(product.playOn)}
                  onClick={async () => {
                    socket.emit("PLAY", product)
                  }}
                  className="font-medium text-blue-600 hover:text-blue-800 disabled:text-blue-100"
                >
                  Play
                </button>
              </td>
            </tr>
            )
          }
        </tbody>
      </table>
      {
        modals.length ? modals.map((modal) => <div key={modal._id} className="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
        <div className="bg-white px-16 pt-8 pb-6 rounded-md text-center">
          {
            <h1 className="text-xl mb-4 font-bold text-slate-500">
              { modal.name }
              <span className={`text-${modal.buyerNotification === 'EXPIRED' ? 'red' : 'green'}-500`}> {modal.buyerNotification}</span>
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
</div>

}