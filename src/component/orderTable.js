import { ArrowDown, ArrowUp, CalendarIcon, Search, History, Currency, Download } from "lucide-react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Order() {
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

      const transactions = [
        {
          status: "Success",
          type: "Payment",
          channel: "Invoice",
          account: "0123456789",
          amount: "IDR 10.000",
          reference: "demo-4",
          date: "1 Feb 2021, 10:58 PM",
          direction: "in",
        },
        {
          status: "Success",
          type: "Disbursement",
          channel: "Bank",
          account: "BCA 0123456789",
          amount: "IDR 20.000",
          reference: "demo-3",
          date: "14 Jan 2021, 04:38 PM",
          direction: "out",
        },
        {
          status: "Success",
          type: "Payment",
          channel: "Virtual Account",
          account: "0123456789",
          amount: "IDR 10.000",
          reference: "demo-2",
          date: "14 Jan 2021, 04:31 PM",
          direction: "in",
        },
        {
          status: "Success",
          type: "Payment",
          channel: "Virtual Account",
          account: "0123456789",
          amount: "IDR 20.000",
          reference: "demo-1",
          date: "14 Jan 2021, 04:07 PM",
          direction: "in",
        }, {
          status: "Success",
          type: "Payment",
          channel: "Virtual Account",
          account: "0123456789",
          amount: "IDR 10.000",
          reference: "demo-2",
          date: "14 Jan 2021, 04:31 PM",
          direction: "in",
        },
        {
          status: "Success",
          type: "Payment",
          channel: "Virtual Account",
          account: "0123456789",
          amount: "IDR 20.000",
          reference: "demo-1",
          date: "14 Jan 2021, 04:07 PM",
          direction: "in",
        },
      ];

    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate("/internal/admin/kasir/order/details")
    }
    return (
        <div>
            {/* header  */}
            <div className="w-full shadow-lg items-center py-5 z-5 bg-white">
                <p className="font-semibold mx-4 text-lg">Orders</p>
            </div>

            <div className="p-5 text-white">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="p-4 cursor-pointer bg-gray-900 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm text-gray-400">Total Incoming Amount</h2>
                            <ArrowDown className="text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold">IDR 40.000</h3>
                        <p className="text-sm text-gray-500">Transactions Count: 3</p>
                    </div>
                    <div className="p-4 cursor-pointer bg-gray-900 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm text-gray-400">Total Outgoing Amount</h2>
                            <ArrowUp className="text-red-400" />
                        </div>
                        <h3 className="text-2xl font-bold">IDR 20.000</h3>
                        <p className="text-sm text-gray-500">Transactions Count: 1</p>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                    {/* Input Start Date */}
                    <div className="w-40">
                        <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-black rounded-md py-1 pl-5 pr-3 text-gray-700 focus:outline-none focus:ring-2  focus:border-black-100 transition-all"
                        />
                    </div>

                    <span className="text-gray-500 font-semibold">-</span>

                    {/* Input End Date */}
                    <div className="w-40">
                        <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-black  rounded-md py-1 pl-5 pr-3 text-gray-700 focus:outline-none focus:ring-2  focus:border-black-100 transition-all"
                        />
                    </div>
                    </div>
                    <div className="relative w-full max-w-md">
                        {/* Icon Search */}
                        <Search className="absolute left-3 top-1/4 transform -translate-y-1/2 text-black" size={20} />
                        {/* Input Search */}
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-1 border placeholder-black text-black border-black rounded-md focus:outline-none focus:ring-2  focus:border-black-100 transition-all"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button className="flex items-center gap-2 px-4 py-1 bg-gray-900 hover:bg-gray-500 rounded-md">
                            <History/>
                            All 
                        </button>
                        <button className="flex items-center gap-2 px-4 py-1 bg-gray-900 hover:bg-gray-500 rounded-md">
                            <Currency/>
                            Today
                        </button>
                        <button className="flex items-center gap-2 px-4 py-1 rounded-md bg-[#00A676] hover:bg-[#00825B]">
                            < Download/>
                            Export
                        </button>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="rounded-lg shadow-md overflow-hidden">
                        <table className="w-full text-left">
                        <thead className="bg-gray-900">
                            <tr>
                            {["Status", "Type", "Channel", "Account", "Amount", "Reference", "Date", ""].map((header) => (
                                <th key={header} className="py-3 px-4 text-white font-medium text-sm">{header}</th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {transactions
                            .filter((t) => t.reference.includes(search))
                            .map((t, index) => (
                                <tr key={index} className="bg-white text-black border-gray-700 hover:bg-gray-700 hover:text-white transition">
                                <td className="py-3 px-4 ]"><p className="text-[#00A676] bg-[#00A67650">{t.status}</p></td>
                                <td className="py-3 px-4">{t.type}</td>
                                <td className="py-3 px-4">{t.channel}</td>
                                <td className="py-3 px-4">{t.account}</td>
                                <td className="py-3 px-4 flex items-center gap-2">
                                    {t.direction === "in" ? <ArrowDown className="text-green-400" /> : <ArrowUp className="text-red-400" />}
                                    {t.amount}
                                </td>
                                <td className="py-3 px-4">{t.reference}</td>
                                <td className="py-3 px-4">{t.date}</td>
                                <td>
                                    <button onClick={() => handleNavigate()} className="rounded-md bg-[#00A676] hover:bg-[#00825B] py-1 px-3 text-white">Accept</button>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
            </div>

        </div>
    )
}