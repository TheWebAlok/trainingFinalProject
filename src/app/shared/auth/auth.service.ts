import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Save user data in sessionStorage
  setData(res: any) {
    sessionStorage.setItem("email", res.email);
    sessionStorage.setItem("name", res.name);
    sessionStorage.setItem("userType", res.userType);
    sessionStorage.setItem("isLogged", "true");
    sessionStorage.setItem("phone", res.phone);
    sessionStorage.setItem("address", res.address);
    sessionStorage.setItem("createdAt", res.createdAt);
  }

  // --------------------------
  // ✅ GETTERS FOR USER DATA
  // --------------------------

  getEmail() {
    return sessionStorage.getItem("email");
  }

  getName() {
    return sessionStorage.getItem("name");
  }

  getPhone() {
    return sessionStorage.getItem("phone");
  }

  getAddress() {
    return sessionStorage.getItem("address");
  }

  getUserType() {
    return sessionStorage.getItem("userType");
  }

  getIsLoggedIn(): boolean {
    return sessionStorage.getItem("isLogged") === "true";
  }

  // --------------------------
  // Clear all session data
  // --------------------------
  clear() {
    sessionStorage.clear();
  }

}
