import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [MatButtonModule, MatProgressBarModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  exports: [MatButtonModule, MatProgressBarModule, MatDialogModule, MatFormFieldModule, MatInputModule],
})
export class MaterialModule {}
