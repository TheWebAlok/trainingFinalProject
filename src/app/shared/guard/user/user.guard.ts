import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


export const userGuard: CanActivateFn = (route, state) => {

  var router = inject(Router)
  var toastr = inject(ToastrService)
  if (sessionStorage.getItem('isLogged') == 'true' && sessionStorage.getItem("email") !== null) {
    return true
  }
  else {
    toastr.error("Unauthorized")
    router.navigateByUrl("/login")
    return false
  }

};