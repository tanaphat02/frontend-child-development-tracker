import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChildComponent } from './list-child.component';

describe('ListChildComponent', () => {
  let component: ListChildComponent;
  let fixture: ComponentFixture<ListChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
