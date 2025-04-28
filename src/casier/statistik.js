import { useState } from "react";
import Sidebar from "../component/sidebar";
import IncomeOutcomeChart from "../component/grafik";
import DonutChart from "../component/donutChart";
import { SalesLineChart, Heatmap } from "../component/grafik";

export default function KasirStatistik() {
    const [activeMenu, setActiveMenu] = useState("statistik")
    const stats = [
        { label: "Profit Margin", value: "98.5%" },
        { label: "Total Keuntungan", value: `IDR 100.000.000` },
        { label: "Total Modal", value: `IDR 150.000.000` },
        { label: "Total Pendapatan", value: `IDR 250.000.000` },
      ];
      const transaction = [
        { label: "Total Transaksi", value: "98.5%" },
        { label: "Rata-rata Harga per Pesanan", value: `IDR 50.000` },
        { label: "Jam Sibuk", value: "16.00 - 17.00" },
      ];
      const donutChartTransaction = {
        data: [20, 30, 50, 100, 55, 80, 99, 120],
        labels: ["Qris", "BCA", "BRI", "BNI", "Mandiri", "Dana", "Gopay", "ShopeePay"],
        colors: [
          "#000000", // Qris (Black)
          "#0d47a1", // BCA (Deep Blue)
          "#ff6600", // BRI (Orange)
          "#0077c8", // BNI (Blue)
          "#ffcc00", // Mandiri (Yellow)
          "#008ef6", // Dana (Sky Blue)
          "#00aa13", // Gopay (Green)
          "#ff5722", // ShopeePay (Red-Orange)
        ],
      };
      const transactionGrafik = {
        data: [0, 27000, 25000, 27000, 40000],
        labels: [
            "25 January 2023",
            "28 January 2023",
            "31 January 2023",
            "1 February 2023",
            "3 February 2023",
          ],
        colors: ["#111827"],
      }
    const options = {
    chart: {
        type: "area",
        height: 300,
        toolbar: { show: false },
        zoom: { enabled: false },
    },
    colors: ["#2563eb", "#9333ea"],
    stroke: {
        curve: "smooth",
        width: 2,
    },
    fill: {
        type: "gradient",
        gradient: {
        shadeIntensity: 0.1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [50, 100, 100, 100],
        },
    },
    grid: {
        strokeDashArray: 2,
        borderColor: "#e5e7eb",
    },
    xaxis: {
        categories: [
        "25 Jan", "26 Jan", "27 Jan", "28 Jan", "29 Jan", "30 Jan", "31 Jan",
        "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb"
        ],
        labels: {
        style: { colors: "#9ca3af", fontSize: "13px" },
        },
    },
    yaxis: {
        labels: {
        style: { colors: "#9ca3af", fontSize: "13px" },
        formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
        },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
        x: { format: "dd MMM" },
        y: {
        formatter: (value) => `$${value >= 1000 ? `${value / 1000}k` : value}`,
        },
    },
    };

    const series = [
    {
        name: "Income",
        data: [18000, 51000, 60000, 38000, 88000, 50000, 40000, 52000, 88000, 80000, 60000, 70000],
    },
    {
        name: "Outcome",
        data: [27000, 38000, 60000, 77000, 40000, 50000, 49000, 29000, 42000, 27000, 42000, 50000],
    },
    ];

    const product = [
        { label: "Terjual", value: "12500" },
        { label: "Paling Laris", value: `steak babi`},
        { label: "Jarang di Pesana", value: "rusa"},
        { label: "Profit Tertinggi", value: "anggur merah"},
        { label: "Penurunan Keuntungan", value: "Jasuke"},
    ]
    const dataHeatmap = [
        [40, 70, 65, 27, 86, 12, 63, 52, 46, 42],
        [37, 10, 16, 70, 33, 31, 51, 47, 1, 21],
        [51, 85, 6, 21, 53, 73, 19, 19, 22, 8],
        [57, 46, 59, 6, 73, 4, 25, 39, 55, 8],
        [62, 47, 53, 46, 4, 34, 80, 59, 38, 73],
        [42, 62, 32, 83, 7, 39, 79, 85, 58, 4],
        [69, 60, 62, 25, 32, 7, 8, 25, 13, 2],
        [11, 29, 7, 41, 63, 35, 28, 30, 56, 41]
      ];
      
      const labelsHeatmap = [
        "Product A",
        "Product B",
        "Product C",
        "Product D",
        "Product E",
        "Product F",
        "Product G",
        "Product H"
      ];
      
      const datesHeatmap = [
        "01", "02", "03", "04", "05", 
        "06", "07", "08", "09", "10"
      ];
    return (
        <div className="flex">
            <div className="w-1/10 min-w-[250px]">
                <Sidebar 
                activeMenu={activeMenu}
                />
            </div>

            <div className="p-6 w-full min-h-screen">
                {/* Financial Summary  */}
                <div className="bg-white rounded-md shadow-lg p-5">
                    <p className="font-semibold text-lg mb-6">Financial Summary</p>
                    <div className="flex justify-between w-full bg-gray-900 px-8 rounded-md space-x-10">
                        {stats.map((stat, index) => (
                        <div key={index} className="py-4 w-full border-r border-white last:border-r-0">
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                            <p className="text-xl text-white font-semibold mt-2">{stat.value}</p>
                        </div>
                        ))}
                    </div>
                    <div className="flex justify-center space-x-10 mt-5">
                        <span className="cursor-pointer text-[#00A676] border-b-2 border-[#00A676]">1D</span>
                        <span className="cursor-pointer">1M</span>
                        <span className="cursor-pointer">3M</span>
                        <span className="cursor-pointer">1Y</span>
                        <span className="cursor-pointer">3Y</span>
                    </div>
                </div>

                {/* Transaksi */}
                <div className="bg-white rounded-md shadow-lg mt-6 p-5">
                    <p className="font-semibold text-lg mb-6">Transaction Summary</p>
                    <div className="flex justify-between w-full bg-gray-900 px-8 rounded-md space-x-10">
                        {transaction.map((stat, index) => (
                            <div key={index} className="py-4 w-full border-r border-white last:border-r-0">
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <p className="text-xl text-white font-semibold mt-2">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center space-x-10 mt-5">
                        <span className="cursor-pointer text-[#00A676] border-b-2 border-[#00A676]">1D</span>
                        <span className="cursor-pointer">1M</span>
                        <span className="cursor-pointer">3M</span>
                        <span className="cursor-pointer">1Y</span>
                        <span className="cursor-pointer">3Y</span>
                    </div>
                    <div className="mt-5">
                        <SalesLineChart data={transactionGrafik.data} labels={transactionGrafik.labels} colors={transactionGrafik.colors}/>
                    </div>
                    <div className="pb-2 mt-5">
                        <DonutChart data={donutChartTransaction.data} labels={donutChartTransaction.labels} colors={donutChartTransaction.colors}/>
                    </div>
                </div>

                {/* Product Profitability */}
                <div className="bg-white rounded-md shadow-lg mt-6 p-5">
                    <div className="">
                        <p className="font-semibold text-lg mb-6">Product Profitability</p>
                        <div className="flex justify-between w-full bg-gray-900 px-8 rounded-md space-x-10">
                            {product.map((stat, index) => (
                                <div key={index} className="py-4 w-full border-r border-white last:border-r-0">
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                    <p className="text-xl text-white font-semibold mt-2">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center space-x-10 my-5">
                            <span className="cursor-pointer text-[#00A676] border-b-2 border-[#00A676]">1D</span>
                            <span className="cursor-pointer">1M</span>
                            <span className="cursor-pointer">3M</span>
                            <span className="cursor-pointer">1Y</span>
                            <span className="cursor-pointer">3Y</span>
                        </div>
                        <div className="flex justify-center">
                            <Heatmap data={dataHeatmap} labels={labelsHeatmap} dates={datesHeatmap}/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}