import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { GrowthService } from '../../services/growth/growth.service';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-child',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './list-child.component.html',
  styleUrl: './list-child.component.css'
})
export class ListChildComponent {
  searchTerm = '';
  children: any[] = [];
  selectedChild: any = null;

  // กราฟการเจริญเติบโต
  growthChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'น้ำหนัก (kg)', yAxisID: 'y1' },
      { data: [], label: 'ส่วนสูง (cm)', yAxisID: 'y2' }
    ]
  };
  growthChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      y1: { type: 'linear', position: 'left', title: { display: true, text: 'น้ำหนัก (kg)' } },
      y2: { type: 'linear', position: 'right', title: { display: true, text: 'ส่วนสูง (cm)' }, grid: { drawOnChartArea: false } }
    }
  };

  constructor(private router: Router, private authService: AuthService, private growthService: GrowthService) {}

  ngOnInit() {
    this.authService.getAllChildren().subscribe({
      next: (res) => {
        this.children = res;
        console.log('✅ Loaded children:', res);
      },
      error: (error) => {
        console.error('❌ Error loading children:', error);
      }
    });
  }

  filteredChildren() {
    try {
      return this.children.filter(c =>
        (c.prefix + c.first_name + ' ' + c.last_name).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error filtering children:', error);
      return [];
    }
  }

  onAddChild() {
    this.router.navigate(['/add-child']);
  }

  viewChild(child: any) {
  forkJoin({
    childData: this.authService.getAllChildrenData(),
    growthRecords: this.growthService.getRecordsByChildId(child.id)
  }).subscribe({
    next: ({ childData, growthRecords }) => {
      // หาเด็กที่ id ตรงกับ child.id
      const fullChild = childData.find((c: any) => c.id === child.id) || child;
      this.selectedChild = { ...fullChild, growthRecords };
      this.updateGrowthChart();
    },
    error: (error) => {
      console.error('❌ Error fetching child data or growth records:', error);
    }
  });
}

  updateGrowthChart() {
  if (!this.selectedChild?.growthRecords) {
    this.growthChartData.labels = [];
    this.growthChartData.datasets[0].data = [];
    this.growthChartData.datasets[1].data = [];
    return;
  }
  // กรองเฉพาะอายุ 1-7 ขวบ (ใช้ age จาก backend)
  const records = this.selectedChild.growthRecords
    .filter((r: any) => r.age >= 1 && r.age <= 7)
    .sort((a: any, b: any) => a.age - b.age);

  this.growthChartData.labels = records.map((r: any) => `${r.age} ขวบ`);
  this.growthChartData.datasets[0].data = records.map((r: any) => r.weight_kg);
  this.growthChartData.datasets[1].data = records.map((r: any) => r.height_cm);
}

  closeModal() {
    this.selectedChild = null;
  }

  onModalBackgroundClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.closeModal();
    }
  }
}