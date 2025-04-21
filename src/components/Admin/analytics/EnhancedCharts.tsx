// components/Admin/analytics/EnhancedCharts.tsx
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// Common chart colors
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#4BC0C0', '#36A2EB', '#9966FF', '#FF6384', '#C9CBCF'
];

interface DataPoint {
  [key: string]: any;
}

interface LineChartProps {
  data: DataPoint[];
  xAxisKey: string;
  lines: {
    dataKey: string;
    name?: string;
    color?: string;
    strokeWidth?: number;
  }[];
  height?: number;
  title?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => [string, string];
}

export const AdvancedLineChart: React.FC<LineChartProps> = ({ 
  data, 
  xAxisKey,
  lines,
  height = 300,
  title,
  yAxisFormatter = value => `${value}`,
  tooltipFormatter = (value, name) => [`${value}`, name]
}) => {
  if (!data || data.length === 0) {
    return <div className="chart-no-data">No data available</div>;
  }

  return (
    <div style={{ width: '100%', height }}>
      {title && <h5 className="chart-title text-center mb-3">{title}</h5>}
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis tickFormatter={yAxisFormatter} />
          <Tooltip 
            formatter={tooltipFormatter} 
            labelFormatter={(label) => `${label}`}
          />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color || COLORS[index % COLORS.length]}
              strokeWidth={line.strokeWidth || 2}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface AreaChartProps {
  data: DataPoint[];
  xAxisKey: string;
  areas: {
    dataKey: string;
    name?: string;
    color?: string;
    stackId?: string;
  }[];
  height?: number;
  title?: string;
  yAxisFormatter?: (value: number) => string;
}

export const AdvancedAreaChart: React.FC<AreaChartProps> = ({
  data,
  xAxisKey,
  areas,
  height = 300,
  title,
  yAxisFormatter = value => `${value}`
}) => {
  if (!data || data.length === 0) {
    return <div className="chart-no-data">No data available</div>;
  }

  return (
    <div style={{ width: '100%', height }}>
      {title && <h5 className="chart-title text-center mb-3">{title}</h5>}
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis tickFormatter={yAxisFormatter} />
          <Tooltip />
          <Legend />
          {areas.map((area, index) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              name={area.name || area.dataKey}
              stackId={area.stackId}
              stroke={area.color || COLORS[index % COLORS.length]}
              fill={area.color || COLORS[index % COLORS.length]}
              fillOpacity={0.3}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface BarChartProps {
  data: DataPoint[];
  xAxisKey: string;
  bars: {
    dataKey: string;
    name?: string;
    color?: string;
    stackId?: string;
  }[];
  height?: number;
  title?: string;
  yAxisFormatter?: (value: number) => string;
  layout?: 'vertical' | 'horizontal';
}

export const AdvancedBarChart: React.FC<BarChartProps> = ({
  data,
  xAxisKey,
  bars,
  height = 300,
  title,
  yAxisFormatter = value => `${value}`,
  layout = 'horizontal'
}) => {
  if (!data || data.length === 0) {
    return <div className="chart-no-data">No data available</div>;
  }

  return (
    <div style={{ width: '100%', height }}>
      {title && <h5 className="chart-title text-center mb-3">{title}</h5>}
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout={layout}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey} 
            type={layout === 'horizontal' ? 'category' : 'number'} 
          />
          <YAxis 
            tickFormatter={yAxisFormatter}
            type={layout === 'horizontal' ? 'number' : 'category'}
          />
          <Tooltip formatter={(value) => [`${value}`, '']} />
          <Legend />
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              stackId={bar.stackId}
              fill={bar.color || COLORS[index % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PieChartProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  title?: string;
  dataKey?: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
  tooltipFormatter?: (value: number, name: string, entry: any) => string;
}

export const AdvancedPieChart: React.FC<PieChartProps> = ({
  data,
  height = 300,
  title,
  dataKey = 'value',
  nameKey = 'name',
  innerRadius = 0,
  outerRadius = 80,
  showLabels = true,
  tooltipFormatter
}) => {
  if (!data || data.length === 0) {
    return <div className="chart-no-data">No data available</div>;
  }

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ width: '100%', height }}>
      {title && <h5 className="chart-title text-center mb-3">{title}</h5>}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabels}
            label={showLabels ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : undefined}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={
              tooltipFormatter || 
              ((value, name) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, name])
            } 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  AdvancedLineChart,
  AdvancedAreaChart,
  AdvancedBarChart,
  AdvancedPieChart
};