import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule,NgxSpinnerModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';

  constructor(
    private firestore: Firestore,
    private toastr: ToastrService
  ) { }

  submit() {
    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const contactData = { name: this.name, email: this.email, message: this.message };
    const contactRef = collection(this.firestore, 'contacts');

    addDoc(contactRef, contactData)
      .then(() => {
        this.toastr.success('Form submitted successfully!', 'Success');
        this.name = '';
        this.email = '';
        this.message = '';
        form.classList.remove('was-validated');
      })
      .catch(() => {
        this.toastr.error('Something went wrong!', 'Error');
      });
  }
}
