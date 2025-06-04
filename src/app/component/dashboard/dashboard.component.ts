import { Component, OnInit } from '@angular/core';
import { GrowthService } from '../../services/growth/growth.service';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Chart, ChartConfiguration } from 'chart.js';

const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart: Chart) {
    const { ctx, chartArea } = chart;
    if (!ctx || !chartArea) return;
    const label = chart.data.labels?.[0];
    const year = typeof label === 'string'
      ? label.match(/\d{4}/)?.[0] || ''
      : '';
    ctx.save();
    ctx.font = 'bold 24px Sarabun, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#222';
    ctx.fillText(year, (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2);
    ctx.restore();
  }
};

Chart.register(centerTextPlugin);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())], // ลบ plugins ออก
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  barDataThin: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  barDataNormal: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  barDataFat: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  doughnutDataThin: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  doughnutDataNormal: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  doughnutDataFat: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  barOptions: ChartConfiguration<'bar'>['options'] = { responsive: true, plugins: { legend: { display: true } } };
  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels!.map((label: any, i: number) => ({
              text: label,
              fillStyle: (data.datasets[0].backgroundColor as string[])[i],
              strokeStyle: (data.datasets[0].backgroundColor as string[])[i],
              index: i
            }));
          }
        }
      }
    }
  };

  constructor(private growthService: GrowthService) {}

  // ...existing code...
ngOnInit() {
  this.growthService.getDashboardStats().subscribe(({ bar, donut }) => {
    const years = Array.from(new Set(bar.map((r: any) => r.year))).sort();
    const currentYear = new Date().getFullYear();

    // เตรียม datasets ชาย/หญิง สำหรับแต่ละ body_status
    const makeDataset = (status: string) => [
      {
        label: 'ชาย',
        data: years.map(y => {
          const found = bar.find((r: any) => r.year == y && r.sex === 'male' && r.body_status === status);
          return found ? +found.count : 0;
        }),
        backgroundColor: '#42a5f5'
      },
      {
        label: 'หญิง',
        data: years.map(y => {
          const found = bar.find((r: any) => r.year == y && r.sex === 'female' && r.body_status === status);
          return found ? +found.count : 0;
        }),
        backgroundColor: '#ffb3b3'
      }
    ];

    this.barDataThin = {
      labels: [...years],
      datasets: makeDataset('น้ำหนักน้อย')
    };
    this.barDataNormal = {
      labels: [...years],
      datasets: makeDataset('น้ำหนักปกติ')
    };
    this.barDataFat = {
      labels: [...years],
      datasets: makeDataset('น้ำหนักเกิน')
    };

    // เตรียมข้อมูลโดนัท
    const total = donut.reduce((sum: number, d: any) => sum + +d.count, 0);
    const getCount = (status: string) => {
      const found = donut.find((d: any) => d.body_status === status);
      return found ? +found.count : 0;
    };
this.doughnutDataThin = {
  labels: [`น้ำหนักน้อย (${currentYear})`, 'อื่นๆ'],
  datasets: [{
    label: `น้ำหนักน้อย (${currentYear})`,
    data: [getCount('น้ำหนักน้อย'), total - getCount('น้ำหนักน้อย')],
    backgroundColor: ['#42a5f5', '#e0e0e0']
  }]
};
this.doughnutDataNormal = {
  labels: [`น้ำหนักปกติ (${currentYear})`, 'อื่นๆ'],
  datasets: [{
    label: `น้ำหนักปกติ (${currentYear})`,
    data: [getCount('น้ำหนักปกติ'), total - getCount('น้ำหนักปกติ')],
    backgroundColor: ['#42a5f5', '#e0e0e0']
  }]
};
this.doughnutDataFat = {
  labels: [`น้ำหนักเกิน (${currentYear})`, 'อื่นๆ'],
  datasets: [{
    label: `น้ำหนักเกิน (${currentYear})`,
    data: [getCount('น้ำหนักเกิน'), total - getCount('น้ำหนักเกิน')],
    backgroundColor: ['#42a5f5', '#e0e0e0']
  }]
};
  });
}

}