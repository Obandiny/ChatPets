import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMascotasComponent } from './table-mascotas.component';

describe('TableMascotasComponent', () => {
  let component: TableMascotasComponent;
  let fixture: ComponentFixture<TableMascotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableMascotasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableMascotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
