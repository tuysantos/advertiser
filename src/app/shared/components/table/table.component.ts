import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface TableData {
  [key: string]: string | number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() tableName = 'Results';
  @Input() addLabel = 'Add New';
  @Input() headers: string[] = [];
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Input()
  set rowData(val: TableData[]) {
    this.buildTable(val);
  }

  @Output() addEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter<number>();
  @Output() deleteEvent = new EventEmitter<number>();

  dataSource: MatTableDataSource<TableData> = new MatTableDataSource<TableData>([]);
  totalRecords = 0;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: any) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = value;
    }
  }

  buildTable(data: TableData[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = data;
    this.totalRecords = data?.length;
  }

  createTitle(label: string): string {
    return label === 'id' ? 'Action' : `${label.charAt(0).toUpperCase()}${label.slice(1).replace('_', ' ')}`;
  }

  editRecord(id: number) {
    this.editEvent.emit(id);
  }

  addNewRecord() {
    this.addEvent.emit();
  }

  deleteRecord(id: number) {
    this.deleteEvent.emit(id);
  }
}
