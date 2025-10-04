import {
  Chart,
  LineController,
  BarController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
  LineElement,
  PointElement,
  BarElement,
  ArcElement
} from 'chart.js';

// Register ALL Chart.js components
Chart.register(
  LineController,
  BarController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
  LineElement,
  PointElement,
  BarElement,
  ArcElement
);

// Global configuration
Chart.defaults.font.family = "'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
Chart.defaults.color = '#6B7280';
Chart.defaults.borderColor = 'rgba(229, 231, 235, 0.5)';

// Dark mode support
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  Chart.defaults.color = '#9CA3AF';
  Chart.defaults.borderColor = 'rgba(55, 65, 81, 0.5)';
}

export default Chart;