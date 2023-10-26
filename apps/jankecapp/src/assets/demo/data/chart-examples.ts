// Here is example of simple bar chart usage. You need to set data for chart and options for chart - options represent settings for chart
// Type of chart should be "bar"
let data: any = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      label: 'Second Dataset',
      data: [28, 48, 40, 19, 86, 27, 90],
    },
  ],
};

let options: any = {
  plugins: {
    title: {
      display: true,
      text: 'My Title',
      font: { size: 16 },
    },
    legend: {
      position: 'bottom',
    },
  },
};

// Here is example of linear multi axis chart
//** Type of chart should be "line"

data = {
  labels: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Pie', 'Phi', 'Rho'],
  datasets: [
    {
      label: 'Dataset 1',
      borderColor: 'violet',
      yAxisID: 'y',
      tension: 0.4,
      fill: true,
      data: [45, 69, 40, 61, 76, 35, 20],
    },
    {
      label: 'Dataset 2',
      borderColor: 'orange',
      yAxisID: 'y1',
      borderDash: [5, 5],
      tension: 0.4,
      data: [48, 28, 60, 39, 65, 47, 50],
    },
  ],
};

options = {
  stacked: false,
  plugins: {
    legend: {
      labels: {
        color: 'black',
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: 'black',
      },
      grid: {
        color: '#ebedef',
      },
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      ticks: {
        color: 'black',
      },
      grid: {
        color: '#ebedef',
      },
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      ticks: {
        color: 'black',
      },
      grid: {
        drawOnChartArea: false,
        color: '#ebedef',
      },
    },
  },
};

// Here is an example of vertical multi axis bar chart
// Type of chart should be "bar"

data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1',
      backgroundColor: 'green',
      AxisID: 'x',
      data: [65, 59, 80, 81, 56, 55, 10],
    },
    {
      label: 'Dataset 2',
      backgroundColor: 'pink',
      AxisID: 'x1',
      data: [28, 48, 40, 19, 86, 27, 90],
    },
    {
      label: 'Dataset 3',
      backgroundColor: 'yellow',
      AxisID: 'x',
      data: [32, 38, 60, 29, 26, 77, 60],
    },
  ],
};

options = {
  indexAxis: 'y',
  plugins: {
    legend: {
      labels: {
        color: '#black',
      },
    },
    tooltips: {
      mode: 'index',
      intersect: true,
    },
  },
  scales: {
    y: {
      ticks: {
        color: '#black',
      },
    },
    x: {
      type: 'linear',
      display: true,
      position: 'left',
      ticks: {
        min: 0,
        max: 100,
        color: '#black',
      },
    },
    x1: {
      type: 'linear',
      display: true,
      position: 'right',

      ticks: {
        min: 0,
        max: 100,
        color: 'red',
      },
    },
  },
};

// Example of horizontal bar chart
// Type of chart should be "bar"

data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1',
      backgroundColor: ['#EC407A', '#AB47BC', '#42A5F5', '#7E57C2', '#66BB6A', '#FFCA28', '#26A69A'],
      yAxisID: 'y',
      data: [65, 59, 80, 81, 56, 55, 10],
    },
    {
      label: 'Dataset 2',
      backgroundColor: '#78909C',
      yAxisID: 'y1',
      data: [28, 48, 40, 19, 86, 27, 90],
    },
  ],
};

options = {
  plugins: {
    legend: {
      labels: {
        color: '#495057',
      },
    },
    tooltips: {
      mode: 'index',
      intersect: true,
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#495057',
      },
      grid: {
        color: '#ebedef',
      },
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      ticks: {
        min: 0,
        max: 100,
        color: '#495057',
      },
      grid: {
        color: '#ebedef',
      },
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
        color: '#ebedef',
      },
      ticks: {
        min: 0,
        max: 100,
        color: '#495057',
      },
    },
  },
};
