import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TableComponent, TableData } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [MatPaginatorModule, MatSortModule, MatTableModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should buildTable', () => {
    let data: TableData[] = [
      {
        field1: 1,
        field2: 'test 123',
      },
      {
        field1: 2,
        field2: 'test 4444',
      },
    ];
    component.buildTable(data);

    expect(component.dataSource.data).toEqual(data);
    expect(component.totalRecords).toEqual(2);
  });

  it('should emit edit event', () => {
    spyOn(component.editEvent, 'emit').and.callThrough();
    component.editRecord(1);

    expect(component.editEvent.emit).toHaveBeenCalledWith(1);
  });

  it('should emit add event', () => {
    spyOn(component.addEvent, 'emit').and.callThrough();
    component.addNewRecord();

    expect(component.addEvent.emit).toHaveBeenCalled();
  });

  it('should emit delete event', () => {
    spyOn(component.deleteEvent, 'emit').and.callThrough();
    component.deleteRecord(1);

    expect(component.deleteEvent.emit).toHaveBeenCalledWith(1);
  });

  it('should create action Title', () => {
    const result = component.createTitle('id');
    expect(result).toEqual('Action');
  });

  it('should create none underscore Title', () => {
    const result = component.createTitle('post_code');
    expect(result).toEqual('Post code');
  });

  it('should set initialise dataSource.sort', () => {
    spyOn(component, 'buildTable').and.callThrough();
    let data: TableData[] = [
      {
        field1: 1,
        field2: 'test 123',
      },
      {
        field1: 2,
        field2: 'test 4444',
      },
    ];

    component.rowData = data;

    expect(component.buildTable).toHaveBeenCalledWith(data);
  });
});
