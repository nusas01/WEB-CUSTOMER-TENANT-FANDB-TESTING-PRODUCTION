import { useState } from "react";
import Sidebar from "../component/sidebar";
import Switcher4 from "../component/toggleSwitcher";
import ModalConfirm from "../component/model";

const KasirSettings = () => {
    const [activeMenu, setActiveMenu] = useState("settings")
    const [settingMenu, setSettingMenu] = useState("account")

    return(
        <div className="flex">
            <div className="w-1/10 min-w-[250px]">
                <Sidebar 
                activeMenu={activeMenu}
                />
            </div>

            <div className="w-full">
                <div className="w-full flex px-6 space-x-7 shadow-lg items-center mt-1 z-5 bg-white">
                    <div onClick={() => setSettingMenu("account")} className={settingMenu === "account" ? "border-b-2 border-gray-900 text-gray-900 cursor-pointer py-5 px-2" : "py-5 cursor-pointer px-2 text-gray-500"}>Account</div>
                    <div onClick={() => setSettingMenu("general")} className={settingMenu === "general" ? "border-b-2 border-gray-900 cursor-pointer py-5 px-2" : "py-5 cursor-pointer px-2 text-gray-500"}>General</div>
                </div>
                { settingMenu === "account" && (
                    <div className="p-6">
                        <ProfileForm/>
                    </div>
                )}
                { settingMenu === "general" && (
                    <div className="p-6">
                        <Settings/>
                    </div>
                )}
            </div>
        </div>
    )
}

const Settings = () => {
    const [paymentFee, setPaymentFee] = useState(false);
    const [caseless, setCaseless] = useState(false);
    return (
        <div className="bg-white rounded-md p-6 shadow-md">
            <p className="font-semibold text-xl">General Settings</p>
            <div className="my-6 flex flex-col space-y-3">
                <div className="flex space-x-5 items-center">
                    <Switcher4 onClick={() => setPaymentFee(true)}/>
                    <p className="text-gray-500">Fee payment gateway di bebankan ke customer</p>
                </div>
                <div className="flex space-x-5 items-center">
                    <Switcher4 onClick={() => setCaseless(true)}/>
                    <p className="text-gray-500">Payment non-cash</p>
                </div>
            </div>
            <div>
                <button className="text-white bg-gray-900 px-10  hover:bg-gray-500 py-1 rounded">Pajak</button>
            </div>
            <div>
                <ModalConfirm/>
            </div>
        </div>
    )
}

const ProfileForm = () => {
    return (
      <div className="bg-white shadow-md p-6 rounded-lg">
        {/* Profile Section */}
        <div className="flex justify-between items-center mt-4">
            <div className="ml-4 flex">
                <img
                    src="https://via.placeholder.com/80"
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                />
                    <h2 className="text-lg font-semibold ml-5">Carlie John</h2>
            </div>
            <button className="text-white bg-gray-900 rounded px-5 py-2 hover:bg-gray-500">
              Upload new picture
            </button>
        </div>
  
        {/* Form Section */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-md font-semibold">Basic Information</h3>
            <p className="text-gray-400 text-sm">Lorem Ipsum is simply dummy text.</p>
            <div className="mt-4 space-y-3">
              <input type="text" placeholder="Your Name" className="w-full px-2 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
              <input type="email" placeholder="Example@gmail.com" className="w-full px-2 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
              <textarea placeholder="Say something about you..." className="h-20 w-full px-2 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"></textarea>
            </div>
          </div>
  
          <div>
            <h3 className="text-md font-semibold">More Information</h3>
            <p className="text-gray-400 text-sm">Lorem Ipsum is simply dummy text.</p>
            <div className="mt-4 space-y-3">
              <input type="text" placeholder="+12 3456 7890" className="w-full px-2 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input type="text" placeholder="Designer" className="w-full px-2 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input type="text" placeholder="Your Location" className="w-full px-2 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input type="text" placeholder="Example.com" className="w-full px-2 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
          </div>
        </div>
  
        {/* Save Changes Button */}
        <div className="flex justify-end space-y-2 mt-6">
            <div className="rounded-lg px-4 py-2 cursor-pointer bg-gray-900 hover:bg-gray-500 text-white">
                Save Changes
            </div>
        </div>
      </div>
    );
  };

  export default KasirSettings;

