import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [MatButtonModule, MatProgressBarModule, MatDialogModule],
  exports: [MatButtonModule, MatProgressBarModule, MatDialogModule],
})
export class MaterialModule {}
