import React from "react";
import Chart from "react-apexcharts";

function IncomeOutcomeChart({ options, series }) {
    return (
        <Chart options={options} series={series} type="area" height={300}/>
    );
}

export const SalesLineChart = ({ data, labels, colors }) => {
    const options = {
      chart: {
        type: "line",
        height: 250,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      series: [{ name: "Sales", data }],
      xaxis: {
        categories: labels,
        labels: {
          style: {
            colors: "#111827",
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
          },
          formatter: (title) => {
            if (!title) return "";
            const newT = title.split(" ");
            return `${newT[0]} ${newT[1].slice(0, 3)}`;
          },
        },
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
          style: { colors: "#111827", fontSize: "12px", fontWeight: 400 },
        },
      },
      stroke: { curve: "straight", width: 4 },
      grid: { borderColor: "#e5e7eb" },
      tooltip: { enabled: true },
      colors: colors || ["#111827"],
    };
  
    return <Chart options={options} series={options.series} type="line" height={250} />;
  };


export const Heatmap = ({ data, labels, dates }) => {
  return (
    <div className="p-4">
      {/* Grid Container */}
      <div className="flex flex-col">
        {/* Heatmap Rows */}
        {labels.map((label, rowIndex) => (
          <div key={rowIndex} className="flex items-center mb-1">
            {/* Y-Axis (Labels) */}
            <div className="min-w-[90px] text-left pr-2">{label}</div>
            {/* Data Points */}
            <div className="flex space-x-1">
              {data[rowIndex].map((value, colIndex) => (
                <div
                  key={colIndex}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                    value <= 33 ? "bg-red-500" : value <= 66 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* X-Axis (Dates) */}
        <div className="flex mt-2">
          <div className="min-w-[90px]"></div> {/* Placeholder agar tanggal sejajar dengan data */}
          <div className="flex space-x-1">
            {dates.map((date, i) => (
              <div key={i} className="w-10 text-center text-sm">{date}</div>
            ))}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <div className="size-2.5 inline-block rounded-sm me-2 bg-red-500 mr-2"></div>
          <span className="text-[13px] text-gray-600 dark:text-neutral-400">Low</span>
        </div>
        <div className="flex items-center">
          <div className="size-2.5 inline-block rounded-sm me-2 bg-yellow-500 mr-2"></div>
          <span className="text-[13px] text-gray-600 dark:text-neutral-400">Medium</span>
        </div>
        <div className="flex items-center">
          <div className="size-2.5 inline-block rounded-sm me-2 bg-green-500 mr-2"></div>
          <span className="text-[13px] text-gray-600 dark:text-neutral-400">High</span>
        </div>
      </div>
    </div>
  );
};

export default IncomeOutcomeChart;