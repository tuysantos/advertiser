import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [MatButtonModule, MatPaginatorModule, MatSortModule, MatTableModule, MatIconModule],
  exports: [MatButtonModule, MatPaginatorModule, MatSortModule, MatTableModule, MatIconModule],
})
export class MaterialModule {}
