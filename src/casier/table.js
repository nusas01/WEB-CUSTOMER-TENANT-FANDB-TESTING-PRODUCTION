import { useState } from "react"
import Sidebar from "../component/sidebar"
import { ArrowDownToLine, Plus, Trash } from 'lucide-react'

export default function KasirTables() {
    const [activeMenu, setActiveMenu] = useState("table")
    const tables = [
        {nomor: 1, image: "table-code.png"},
        {nomor: 2, image: "table-code.png"},
        {nomor: 3, image: "table-code.png"},
        {nomor: 4, image: "table-code.png"},
        {nomor: 5, image: "table-code.png"},
        {nomor: 6, image: "table-code.png"},
        {nomor: 7, image: "table-code.png"},
        {nomor: 8, image: "table-code.png"},
    ]
    return (
        <div className="flex">
            <div className="w-1/10 min-w-[250px]">
                <Sidebar activeMenu={activeMenu}/>
            </div>

            <div className="flex-1">
                <div className="w-full shadow-lg items-center py-5 z-5 bg-white">
                    <p className="font-semibold mx-4 text-lg">Products</p>
                </div>

                <div className="p-6">
                    <div className="p-5 rounded-md bg-white shadow-md">
                        <div>
                            <p className="text-xl">Kasir</p>
                            <div className="border mt-5 inline-block py-3 px-2 rounded-md">
                                <div className="px-6">
                                    <img src={require("../image/table-code.png")} className="w-[150px] h-[150px]"/>
                                </div>
                                <div className="flex items-center gap-1 justify-center px-3 py-1 mt-2 border rounded-md text-red-600 hover:bg-red-100">
                                    <ArrowDownToLine size={20}/>
                                    <p>Download</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 rounded-md bg-white mt-5 shadow-md">
                        <div className="flex items-center justify-between">
                            <p className="text-xl">Table</p>
                            <div className="flex space-x-2">
                                <div className="rounded-lg px-5 flex space-x-2 py-2 cursor-pointer border bg-red-100 rounded-md text-red-600 hover:bg-red-200">
                                    <Trash/>
                                    <p>Delete</p>
                                </div>
                                <div className="rounded-lg px-5 flex space-x-2 py-2 cursor-pointer bg-gray-800 hover:bg-gray-900 text-white">
                                    <Plus/>
                                    <p>Table</p>
                                </div>
                            </div>
                        </div>
                        <div className=" mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {tables.map((value) => (
                                <div className="border inline-block py-3 px-2 text-center rounded-md">
                                    <p className="text-center">{value.nomor}</p>
                                    <div className="flex justify-center">
                                        <img src={require(`../image/${value.image}`)} className="w-[150px] h-[150px]" />
                                    </div>
                                    <div className="flex justify-center items-center gap-1 px-3 py-1 mt-2 border rounded-md text-red-600 hover:bg-red-100">
                                        <ArrowDownToLine size={20} />
                                        <p>Download</p>
                                    </div>
                                </div>                            
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 