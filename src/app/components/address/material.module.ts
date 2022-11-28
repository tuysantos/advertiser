import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [MatButtonModule, MatFormFieldModule, MatDialogModule, MatProgressBarModule, MatInputModule, MatIconModule],
  exports: [MatButtonModule, MatFormFieldModule, MatProgressBarModule, MatInputModule, MatDialogModule, MatIconModule],
})
export class MaterialModule {}
