import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Graph = ({ chartData }) => {
  console.log(chartData);

  const newItems = {
    labels: [],
    datasets: [],
  };

  newItems.datasets = chartData.datasets.map((item) => ({
    ...item,
    data: item.data.map((itemData) => itemData.percent),
  }));

  newItems.labels = chartData.labels;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
        },
        ticks: {
          callback: function (value) {
            if (typeof value === "string") {
              value = value.split(" ")[0];
            }
            return value;
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 0,
        ticks: {
          callback: function (value) {
            const valueMain = value.toFixed(2);
            return Number(valueMain) !== 0
              ? ((Number(valueMain) * 100) | 0) + "%"
              : 0;
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (contextTitle) {
            let label = "";

            contextTitle.forEach((item) => {
              label =
                newItems.datasets[item.datasetIndex].data[item.dataIndex]
                  .profit ?? 0;
            });

            return label;
          },
          label: function (context) {
            const datasetIndex = context.datasetIndex;
            const dataIndex = context.dataIndex;
            const dataset = context.chart.data.datasets[datasetIndex];
            let label = context.dataset.label ?? "";

            if (!label) {
              label += ": ";
            }

            if (dataIndex === 0) {
              return label + "0%";
            }

            const currentValue = (
              Number(dataset.data[dataIndex]) * 100
            ).toFixed(2);
            label += " " + currentValue + "%";

            return label;
          },
        },
      },
    },
  };

  //@ts-ignore
  return <Line height={525} data={newItems} options={chartOptions} />;
};

export default Graph;
