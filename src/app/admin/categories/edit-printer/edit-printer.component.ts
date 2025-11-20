import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrinterService } from '../../../services/printer/printer.service';
import { Printer } from '../../../shared/models/printer/printer.model';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-printer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-printer.component.html',
  styleUrls: ['./edit-printer.component.css']
})
export class EditPrinterComponent implements OnInit {
  printerId: string = '';
  printer: Printer = {
    id: '',
    name: '',
    brand: '',
    price: 0,
    stock: 0,
    description: '',
    imageUrl: '',
    categoryId: '',
    categoryName: '',
  };

  selectedImage: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private printerService: PrinterService,
    private cloudinaryService: CloudinaryService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.printerId = this.route.snapshot.paramMap.get('id') || '';

    try {
      const data = await this.printerService.getPrinterById(this.printerId);
      if (data) {
        this.printer = data;
        this.previewUrl = this.printer.imageUrl || null;
      } else {
        this.toastr.error('Printer not found!');
        this.router.navigate(['/admin/all-printer']);
      }
    } catch (err) {
      console.error(err);
      this.toastr.error('Error loading printer data');
    } finally {
      this.loading = false;
    }
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.selectedImage);
    }
  }

  async onUpdate() {
    if (!this.printerId) return;

    const confirmResult = await Swal.fire({
      title: 'Confirm Update',
      text: 'Do you want to update this printer?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel'
    });

    if (!confirmResult.isConfirmed) return;

    try {
      if (this.selectedImage) {
        const uploadRes: any = await this.cloudinaryService.uploadImage(this.selectedImage).toPromise();
        this.printer.imageUrl = uploadRes.secure_url;
      }

      await this.printerService.updatePrinter(this.printerId, this.printer);
      this.toastr.success('Printer updated successfully!');
      this.router.navigate(['/admin/all/printers']);
    } catch (err) {
      console.error(err);
      this.toastr.error('Error updating printer!');
    }
  }
}
