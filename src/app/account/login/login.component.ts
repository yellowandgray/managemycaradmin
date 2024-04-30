import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/api/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

// Login Component
export class LoginComponent {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;

  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();

  constructor(private formBuilder: UntypedFormBuilder, private authenticationService: AuthenticationService, private router: Router,
    private authFackservice: AuthfakeauthenticationService, private route: ActivatedRoute,private ApiService: ApiService ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  
  onSubmit1() {
    this.submitted = true;

    

    // Login Api

   /* this.authenticationService.login(this.f['email'].value, this.f['password'].value).subscribe((data: any) => {
      if (data.status == 'success') {
        localStorage.setItem('toast', 'true');
        localStorage.setItem('currentUser', JSON.stringify(data.data));
        localStorage.setItem('token', data.token);
        this.router.navigate(['/']);
      }
    }); */


    

    // stop here if form is invalid
    // if (this.loginForm.invalid) {
    //   return;
    // } else {
    //   if (environment.defaultauth === 'firebase') {
    //     this.authenticationService.login(this.f['email'].value, this.f['password'].value).then((res: any) => {
    //       this.router.navigate(['/']);
    //     })
    //       .catch(error => {
    //         this.error = error ? error : '';
    //       });
    //   } else {
    //     this.authFackservice.login(this.f['email'].value, this.f['password'].value).pipe(first()).subscribe(data => {
    //           this.router.navigate(['/']);
    //         },
    //         error => {
    //           this.error = error ? error : '';
    //         });
    //   }
    // }


  }

  async onSubmit() {
    this.submitted = true;
    console.log("111111");
if (this.loginForm.invalid) {
  console.log("353465");
      return;
    }
    let dataUser = await this.ApiService.getAdminDataCheck(this.f['email'].value,this.f['password'].value);
    console.log("asgeg"+dataUser);
    let users: any = [];
    dataUser!.forEach(d => {
      users.push(d);
    });
    console.log("sdgdh"+users);
    if (users.length > 0) {
      console.log(users[0].data()['email']);
      if (this.f['email'].value === users[0].data()['email'] &&  this.f['password'].value === users[0].data()['password']) {
        localStorage.setItem('id',users[0].data()['email']);
        localStorage.setItem('login', 'true');
        // localStorage.setItem('school_id', users[0].data()['school']);
        localStorage.setItem('role', users[0].data()['role']);
       // localStorage.setItem('username', users[0].data()['name']);
        localStorage.setItem('username', 'Vaidy');
        localStorage.setItem('userPicture', "assets/images/mmc-logo-car-only.png");
        // console.log(localStorage.getItem('school_id'));
        // console.log(localStorage.getItem('role'));

      this.router.navigate(['/']);

      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          confirmButtonColor: '#4b93ff',
          showCancelButton: true,
         
          
        });        // this._snackBar.data.open('Invalid login details', '', {
        //   duration: 2000,
        //   panelClass: "error-snackbar"

        // });
      }
    }
    else {
      Swal.fire({
        icon: 'success',
        title: 'Failed!',
        confirmButtonColor: '#4b93ff',
        showCancelButton: true,
       
        
      });   
      // this._snackBar.open('Invalid login details', '', {
      //   duration: 2000,
      //   panelClass: "error-snackbar"

      // });
    }
  }


  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
