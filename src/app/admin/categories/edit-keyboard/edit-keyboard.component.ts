import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { KeyboardService } from '../../../services/keyboard/keyboard.service';
import { Keyboard } from '../../../shared/models/keyboard/keyboard.model';

@Component({
  selector: 'app-edit-keyboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-keyboard.component.html',
  styleUrls: ['./edit-keyboard.component.css']
})
export class EditKeyboardComponent implements OnInit {
  keyboard: Keyboard = {} as Keyboard;
  selectedFile: File | null = null;
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private keyboardService: KeyboardService,
    private cloudinaryService: CloudinaryService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getKeyboardById(this.id);
  }

  getKeyboardById(id: string) {
    this.keyboardService.getKeyboardById(id).subscribe({
      next: (data) => this.keyboard = data,
      error: (err) => console.error(err)
    });
  }

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateKeyboard(form: NgForm) {
    if (form.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    const updateAction = () => {
      this.keyboardService.updateKeyboard(this.id, this.keyboard)
        .then(() => {
          this.toastr.success('Keyboard updated successfully!');
          this.router.navigate(['/admin/all/Keyboard']);
        })
        .catch((err) => {
          console.error(err);
          this.toastr.error('Update failed!');
        });
    };

    if (this.selectedFile) {
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          this.keyboard.imageUrl = res.secure_url;
          updateAction();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Image upload failed!');
        }
      });
    } else {
      updateAction();
    }
  }
}
