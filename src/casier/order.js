import Sidebar from "../component/sidebar"
import Order from "../component/orderTable"
import { useState } from "react"

export default function KasirOrders() {
    const [activeMenu, setActiveMenu] = useState("Orders")

    return (
        <div className="flex">
            {/* Sidebar - Fixed width */}
            <div className="w-1/10 min-w-[250px]">
                <Sidebar 
                activeMenu={activeMenu}
                />
            </div>

            <div className="flex-1">
                <Order/>
            </div>
        </div>
    )
} 