import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { GrowthService } from '../../services/growth/growth.service';    

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './record.component.html',
  styleUrl: './record.component.css',
})
export class RecordComponent {
  searchTerm = '';
  children: any[] = [];
  records: any = {};
  latestRecords: any = {}; // เก็บข้อมูลล่าสุดของแต่ละคน

  constructor(private authService: AuthService, private growthService: GrowthService) {}

  ngOnInit() {
    this.authService.getAllChildren().subscribe({
      next: (res) => {
        this.children = res;
        this.children.forEach((child) => {
          // ดึงข้อมูลล่าสุดของแต่ละคน
          this.growthService.getLastRecordById(child.id).subscribe({
            next: (last) => {
              this.latestRecords[child.id] = last || {};
              this.records[child.id] = {
                weight: '',
                height: '',
                bmi: this.latestRecords[child.id]?.bmi || null,
              };
            },
            error: () => {
              // ถ้าไม่มีข้อมูลล่าสุด
              this.latestRecords[child.id] = {};
              this.records[child.id] = {
                weight: '',
                height: '',
                bmi: null,
              };
            },
          });
        });
      },
      error: (error) => {
        console.error('❌ Error loading children:', error);
      },
    });
  }

  calcBMI(weight: any, height: any): string | null {
    if (!weight || !height) return null;
    const h = Number(height) / 100;
    if (h === 0) return null;
    const bmi = Number(weight) / (h * h);
    return bmi ? bmi.toFixed(2) : null;
  }

  getBmiStatus(bmi: any): string {
    const val = parseFloat(bmi);
    if (isNaN(val)) return '';
    if (val < 18.5) return `น้ำหนักน้อย (BMI: ${val})`;
    if (val < 23) return `สมส่วน (BMI: ${val})`;
    if (val < 25) return `น้ำหนักเกิน (BMI: ${val})`;
    return `อ้วน (BMI: ${val})`;
  }

  onInput(child: any) {
    const rec = this.records[child.id];
    if (rec.weight && rec.height) {
      rec.bmi = this.calcBMI(rec.weight, rec.height);
    } else {
      // ถ้าไม่กรอก ให้โชว์ค่าเก่า
      rec.bmi = this.latestRecords[child.id]?.bmi || null;
    }
  }

  getAgeFromBirthdate(birthdate: string): number | null {
    if (!birthdate) return null;
    const birth = new Date(birthdate);
    if (isNaN(birth.getTime())) return null; // กัน birthdate ไม่ถูก format
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  filteredChildren() {
    try {
      return this.children.filter((c) =>
        `${c.prefix}${c.first_name} ${c.last_name}`
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error filtering children:', error);
      return [];
    }
  }

  getBmiStatusEnum(bmi: any): "น้ำหนักน้อย" | "น้ำหนักปกติ" | "น้ำหนักเกิน" {
  const val = parseFloat(bmi);
  if (isNaN(val)) return "น้ำหนักน้อย";
  if (val < 18.5) return "น้ำหนักน้อย";
  if (val < 23) return "น้ำหนักปกติ";
  return "น้ำหนักเกิน";
}

async saveAll() {
  const data = this.children
    .filter(
      (child) =>
        this.records[child.id].weight && this.records[child.id].height
    )
    .map((child) => {
      let sex: 'male' | 'female' | undefined;
      if (child.prefix === 'เด็กชาย') sex = 'male';
      else if (child.prefix === 'เด็กหญิง') sex = 'female';
      const bmi = this.calcBMI(this.records[child.id].weight, this.records[child.id].height);
      return {
        child_id: child.id,
        age: this.getAgeFromBirthdate(child.birth_date),
        sex,
        body_status: this.getBmiStatusEnum(bmi),
        bmi,
        weight_kg: this.records[child.id].weight,
        height_cm: this.records[child.id].height,
        recorded_at: new Date().toISOString(),
      };
    })
    .filter(d => d.sex);

  if (data.length === 0) {
    alert('กรุณากรอกข้อมูลอย่างน้อย 1 คน');
    return;
  }
  try {
    await Promise.all(data.map((d) => firstValueFrom(this.growthService.createRecord(d))));
    alert('บันทึกสำเร็จ');
  } catch {
    alert('บันทึกไม่สำเร็จ');
  }
}
}
