import React from "react";
import Chart from "react-apexcharts";

const DonutChart = ({ data, labels, colors }) => {
  const options = {
    chart: {
      type: "donut",
      height: 230,
    },
    labels: labels,
    plotOptions: {
      pie: {
        donut: {
          size: "76%",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 5,
      colors: ["#fff"],
    },
    tooltip: {
      enabled: true,
    },
    colors: colors,
  };

  return (
    <div>
        <Chart options={options} series={data} type="donut" height={230} />
        <div class="flex justify-center sm:justify-end items-center gap-x-4 ">
            {labels.map((label, i) => (
                <div class="inline-flex items-center">
                    <span
                    className="size-2.5 inline-block rounded-sm me-2"
                    style={{ backgroundColor: colors[i] }}
                    ></span>
                    <span class="text-[13px] text-gray-600 dark:text-neutral-400">
                        {label}
                    </span>
                </div>
            ))}
        </div>
    </div>
  ) 
};

export default DonutChart;
