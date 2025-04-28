import { useState } from "react"
import Sidebar from "../component/sidebar"
import TransactionTable from "../component/transactionTable"
import Order from "../component/orderTable"

export default function KasirTransaction() {
    const [activeMenu, setActiveMenu] = useState("Transaction")

    return (
        <div className="flex">
        {/* Sidebar - Fixed width */}
        <div className="w-1/10 min-w-[250px]">
            <Sidebar 
            activeMenu={activeMenu}
            />
        </div>

        {/* Content - Flexible width */}
        <div className="flex-1">
            <TransactionTable />
        </div>
    </div>
    )
}