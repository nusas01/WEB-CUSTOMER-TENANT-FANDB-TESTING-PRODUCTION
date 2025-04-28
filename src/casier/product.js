import Sidebar from "../component/sidebar"
import ProductsTable from "../component/productTable"
import { useState } from "react"

export default function KasirProducts() {
    const [activeMenu, setActiveMenu] = useState("Product")
    return (
        <div className="flex">
            {/* Sidebar - Fixed width */}
            <div className="w-1/10 min-w-[250px]">
                <Sidebar 
                activeMenu={activeMenu}
                />
            </div>

            <div className="flex-1">
                <ProductsTable/>
            </div>
        </div>
    )
}