import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrinterService } from '../../../services/printer/printer.service';
import { Printer } from '../../../shared/models/printer/printer.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-printer',
  standalone: true,
  //Add RouterLink here
  imports: [CommonModule, RouterLink],
  templateUrl: './all-printer.component.html',
  styleUrls: ['./all-printer.component.css']
})
export class AllPrinterComponent implements OnInit {
  printers: Printer[] = [];

  constructor(
    private printerService: PrinterService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrinters();
  }

  loadPrinters() {
    this.printerService.getPrinters().subscribe({
      next: (res: Printer[]) => {
        this.printers = res;
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Failed to load printers');
      }
    });
  }

  editPrinter(id: string) {
    this.router.navigate(['/admin/edit-printer', id]);
  }

  deletePrinter(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This printer will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.printerService.deletePrinter(id)
          .then(() => this.toastr.success('Printer deleted successfully'))
          .catch(() => this.toastr.error('Error deleting printer'));
      }
    });
  }
}
