import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
} from '@angular/material/dialog';

@Component({
    selector: 'app-exit-dialog',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogContent,
        MatDialogActions,
    ],
    templateUrl: './exit-dialog.component.html',
    styleUrl: './exit-dialog.component.scss'
})
export class ExitDialogComponent {
    constructor(public dialogRef: MatDialogRef<ExitDialogComponent>) {};

    onCancelExit(): void {
        this.dialogRef.close();
    }

    onAgreeToExit(): void {
        this.dialogRef.close('exit');
    }
}
