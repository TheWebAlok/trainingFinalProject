import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CollectionReference, doc, DocumentData, Firestore, collection, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dbPath = '/users';
  private userRef: CollectionReference<DocumentData>;

  constructor(
  private db: Firestore,
  private auth: Auth,
  private toastr: ToastrService,
  private spinner: NgxSpinnerService,
  private router: Router,
  private authService: AuthService
) {
  this.userRef = collection(this.db, this.dbPath);
}

  register(data: any) {
    this.spinner.show()
    return createUserWithEmailAndPassword(this.auth, data.email, data.password).then((res: any) => {
      let uid = res.user.uid
      data.uid = uid
      data.status = true
      data.userType = 2
      data.createdAt = Date.now()
      delete data.password
      setDoc(doc(this.userRef, uid), data).then((r: any) => {
        this.spinner.hide()
        this.toastr.success("User Registered Successfully")
        this.router.navigateByUrl("/login")
      },
        (err: any) => {
          this.spinner.hide()
          console.log(err);
          this.toastr.error(err)
        }
      )
    },
      (err: any) => {
        this.spinner.hide()
        console.log(err);
        this.toastr.error(err)
      }
    )
  }
  // login

  login(email: any, password: any) {
    this.spinner.show()
    return signInWithEmailAndPassword(this.auth, email, password).then(async (res: any) => {
      let uid = res.user.uid
      let userSnap = await getDoc(doc(this.userRef, uid));
      if (userSnap.exists()) {
        let userData = userSnap.data()
        if (userData['status'] == false) {
          this.spinner.hide()
          this.toastr.error("Your Acount is Inactive", "Please Contact Admin")
        }
        else {
          if (userData['userType'] == 1) {
            this.spinner.hide()
            this.authService.setData(userData);
            this.router.navigateByUrl("/admin/dashboard")
          }
          else if (userData['userType'] == 2) {
            this.spinner.hide()
            this.authService.setData(userData)
            this.toastr.success("Login Successful!. Thank You")

            this.router.navigateByUrl("/home")
          }
          else {
            this.spinner.hide()
            this.toastr.error("Invalid User Type")
          }
        }
      }
      else {
        this.spinner.hide()
        this.toastr.error("Error")

      }
    },
      (err: any) => {
        this.spinner.hide();
        console.log(err);
        this.toastr.error(err.message || "Login Failed", "Error");
      })

  }

}
