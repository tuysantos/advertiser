import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { TableComponent } from './table.component';

@NgModule({
  imports: [CommonModule, MaterialModule],
  exports: [TableComponent],
  declarations: [TableComponent],
})
export class TableModule {}
