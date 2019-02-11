import React from 'react';
import Chart from './chart';

export default function(props) {
  const creator = (chart, data) => {
    const { source, type } = data;
    chart.source(source);
    // scale转换数据
    chart.scale('date', { type: 'timeCat', tickCount: 5 });
    chart.scale('value', { tickCount: 5 });
    chart.axis('date', {
      label(text, index, total) {
        if (index === 0) {
          return { fontSize: 30, textAlign: 'left' };
        }
        if (index === total - 1) {
          return { fontSize: 30, textAlign: 'right' };
        }
        return { fontSize: 30 };
      },
    });
    // axis定义两条坐标轴
    chart.axis('value', {
      label(text) {
        return {
          fontSize: 30,
        };
      },
    });
    // 左上角的图标
    chart.legend({
      custom: false,
      nameStyle: {
        fill: '#808080',
        fontSize: 40,
      }, // 图例项 key 值文本样式
      valueStyle: {
        fill: '#333',
        fontWeight: 'bold', // 图例项 value 值文本样式
        fontSize: 40,
      },
    });
    // tooltip是点击数据是出现的信息框
    chart.tooltip({
      custom: false,
      showXTip: true,
      showYTip: true,
      showCrosshairs: true,
      showItemMarker: false,
      background: {
        radius: 2,
        fill: '#1890FF',
        padding: [3, 5],
      },
      nameStyle: {
        fontSize: 40,
        fill: '#fff',
      },
      valueStyle: {
        color: '#eee',
        fontSize: 40,
      },
      onChange(obj) {
        const legend = chart.get('legendController').legends.top[0];
        const tooltipItems = obj.items;
        const legendItems = legend.items;
        const map = {};

        legendItems.forEach(item => {
          map[item.name] = JSON.parse(JSON.stringify(item));
        });
        tooltipItems.forEach(({ name, value }) => {
          if (map[name]) {
            map[name].value = Number(value).toFixed(2);
          }
        });
        legend.setItems(Object.values(map));
      },
      onHide() {
        const legend = chart.get('legendController').legends.top[0];
        legend.setItems(chart.getLegendItems().country);
      },
    });

    // 折线图
    if (type === 'line') {
      chart
        .line()
        .position('date*value')
        .color('type')
        .style({
          stroke: 'purple',
        });
    }

    // 柱状图
    if (type === 'bar') {
      chart
        .interval()
        .position('date*value')
        .color('type')
        .adjust({
          type: 'dodge',
          marginRatio: 0.05,
        });
    }
    chart.render();
  };

  const { width = window.innerWidth, height } = props;

  if (!props.data.length) {
    return null;
  }

  const source = [];

  props.data.forEach(({ name, stats }) => {
    stats.forEach(({ t, v }) => {
      const date = t.split('');
      date.splice(4, 0, '-');
      date.push('-01');
      source.push({ type: name, date: date.join(''), value: v });
    });
  });

  return (
    <div>
      <Chart data={{ source, type: props.type }} width={width} height={height} creator={creator} />
    </div>
  );
}
