import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { LocationService } from '../../services/location/location.service';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';

function thaiIdValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return value && value.length === 13 && /^\d+$/.test(value) ? null : { thaiId: true };
}

function birthDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const today = new Date();
  const inputDate = new Date(value);
  return inputDate > today ? { futureDate: true } : null;
}


@Component({
  selector: 'app-add-child',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './add-child.component.html',
  styleUrls: ['./add-child.component.css'],
})
export class AddChildComponent implements OnInit {
  form: FormGroup;
  provinces: any[] = [];
  districts: any[] = [];
  subDistricts: any[] = [];
  postalCodes: string[] = [];
  sameAddress = false;

  regDistricts: any[] = [];
  regSubDistricts: any[] = [];
  regPostalCodes: string[] = [];

  filteredProvince$: Observable<string[]> = of([]);
  filteredRegProvince$: Observable<string[]> = of([]);
  private currentToRegSub?: any;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      childData: this.fb.group({
        prefix: ['', Validators.required],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        citizen_id: ['', [Validators.required, thaiIdValidator]],
        nationality: ['', Validators.required],
        ethnicity: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        religion: ['', Validators.required],
        blood_type: ['', Validators.required],
        birth_date: ['', [Validators.required, birthDateValidator]],
        sameAddress: [false],
        currentAddress: this.fb.group({
          house_no: ['', Validators.required],
          village_no: [''],
          road: [''],
          alley: [''],
          province: ['', Validators.required],
          district: ['', Validators.required],
          sub_district: ['', Validators.required],
          postal_code: ['', Validators.required],
        }),
        regAddress: this.fb.group({
          house_no: ['', Validators.required],
          village_no: [''],
          road: [''],
          alley: [''],
          province: ['', Validators.required],
          district: ['', Validators.required],
          sub_district: ['', Validators.required],
          postal_code: ['', Validators.required],
        }),
        father: this.fb.group({
          prefix: [''],
          first_name: [''],
          last_name: [''],
          phone: ['', Validators.pattern(/^\d{10}$/)],
          occupation: [''],
          income_per_year: ['', Validators.pattern(/^\d+$/)],
          age: ['', Validators.pattern(/^\d+$/)],
        }),
        mother: this.fb.group({
          prefix: [''],
          first_name: [''],
          last_name: [''],
          phone: ['', Validators.pattern(/^\d{10}$/)],
          occupation: [''],
          income_per_year: ['', Validators.pattern(/^\d+$/)],
          age: ['', Validators.pattern(/^\d+$/)],
        }),
        guardian: this.fb.group({
          prefix: [''],
          first_name: [''],
          last_name: [''],
          phone: ['', Validators.pattern(/^\d{10}$/)],
          occupation: [''],
          income_per_year: ['', Validators.pattern(/^\d+$/)],
          age: ['', Validators.pattern(/^\d+$/)],
          relationship: [''],
        }),
      }),
    });
  }

  ngOnInit() {
    this.loadProvinces();
  }

  loadProvinces() {
    this.locationService.getProvinces().subscribe((data: any) => {
      this.provinces = Object.values(data);

      this.filteredProvince$ = this.form
        .get('childData.currentAddress.province')!
        .valueChanges.pipe(
          startWith(''),
          map((val: string) => this.filterProvinces(val))
        );

      this.filteredRegProvince$ = this.form
        .get('childData.regAddress.province')!
        .valueChanges.pipe(
          startWith(''),
          map((val: string) => this.filterProvinces(val))
        );
    });
  }

  filterProvinces(value: string): string[] {
    return this.provinces
      .map((p: any) => p.name_th)
      .filter((name) => name.includes(value));
  }

  onProvinceSelected(provinceName: string, isReg: boolean = false) {
    const selected = this.provinces.find((p) => p.name_th === provinceName);
    if (selected) {
      const target = isReg ? 'regAddress' : 'currentAddress';
      this.form.get(`childData.${target}.province`)?.setValue(provinceName);

      this.locationService.getDistricts(selected.id).subscribe((all: any) => {
        const districts = Object.values(all).filter(
          (d: any) => d.province_id == selected.id
        );
        if (isReg) this.regDistricts = districts;
        else this.districts = districts;
      });
    }
  }

  onDistrictSelected(districtName: string, isReg: boolean = false) {
    const districts = isReg ? this.regDistricts : this.districts;
    const selected = districts.find((d: any) => d.name_th === districtName);
    if (selected) {
      const target = isReg ? 'regAddress' : 'currentAddress';
      this.form.get(`childData.${target}.district`)?.setValue(districtName);

      this.locationService
        .getSubDistricts(selected.id)
        .subscribe((all: any) => {
          const subDistricts = Object.values(all).filter(
            (s: any) => s.amphure_id == selected.id
          );
          if (isReg) this.regSubDistricts = subDistricts;
          else this.subDistricts = subDistricts;
        });
    }
  }

  onSubDistrictSelected(subDistrictName: string, isReg: boolean = false) {
    const subDistricts = isReg ? this.regSubDistricts : this.subDistricts;
    const selected = subDistricts.find(
      (s: any) => s.name_th === subDistrictName
    );
    if (selected) {
      const target = isReg ? 'regAddress' : 'currentAddress';
      this.form
        .get(`childData.${target}.sub_district`)
        ?.setValue(subDistrictName);
      this.form
        .get(`childData.${target}.postal_code`)
        ?.setValue(selected.zip_code);
      if (isReg) this.regPostalCodes = [selected.zip_code];
      else this.postalCodes = [selected.zip_code];
    }
  }

  onSameAddressChange(event: MatCheckboxChange) {
  const regAddress = this.form.get('childData.regAddress');
  const currentAddress = this.form.get('childData.currentAddress');
  if (event.checked) {
    regAddress?.setValue({ ...currentAddress?.value });
    regAddress?.disable({ emitEvent: false });
  } else {
    regAddress?.enable({ emitEvent: false });
  }
}

  onSubmit() {
    if (this.form.valid) {
      const childData = { ...this.form.value.childData };
      // ถ้า sameAddress ให้ copy currentAddress ไป regAddress ก่อนส่ง
      if (childData.sameAddress) {
        childData.regAddress = { ...childData.currentAddress };
      }
      this.authService.createChild(childData).subscribe({
        next: () => {
          alert('บันทึกข้อมูลสำเร็จ');
          this.router.navigate(['/list']);
        },
        error: () => alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล'),
      });
    }
  }

  
}

