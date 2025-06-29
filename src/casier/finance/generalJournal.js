import Sidebar from "../component/sidebar"

export default function GeneralJournal() {
    return (
        <div className="flex">
            <div className="w-1/10 min-w-[250px]">
                <Sidebar activeMenu={activeMenu}/>
            </div>

            <div className="flex-1">
                
            </div>
        </div>
    )
}