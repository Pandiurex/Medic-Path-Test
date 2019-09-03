import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SignupService } from './signup.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService, HttpClient]
})

export class SignupComponent implements OnInit {

  
  forma: FormGroup;
  
  private values : HttpParams;
  sexos = ['Hombre', 'Mujer', 'Indefinido'];


  constructor(private signupServ : SignupService, private http : HttpClient) {
    this.forma = new FormGroup({

      nombrecompleto: new FormGroup({
        nombre: new FormControl('', [
          Validators.required,
          Validators.minLength(3)
        ]),
        apellido: new FormControl('', [
          Validators.required,
          Validators.minLength(3)
          // this.noEstrada
        ])
      }),
      correo: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'),
      ]),
      genero: new FormControl('Indefinido', Validators.required),
      pasatiempos: new FormArray([new FormControl('Correr', Validators.required)]),
      username: new FormControl('', Validators.required, this.existeUsuario),
      password1: new FormControl('', Validators.required),
      password2: new FormControl(),
    });

    this.forma.controls.password2.setValidators([
      Validators.required,
      this.noIgual.bind(this.forma)
    ]);

    this.forma.controls.username.valueChanges
      .subscribe(data => {
        console.log(data);
      });

    this.forma.controls.username.statusChanges
      .subscribe(data => {
        console.log(data);
      });

    // this.forma.patchValue( this.usuario );

  }


  ngOnInit() { }

  guardarCambios() {
    console.log(this.forma.value);
    console.log(this.forma);
    this.values = new HttpParams()
    .set('nickname', this.forma.value.username)
    .set('email', this.forma.value.correo)
    .set('sexo', this.forma.value.genero)
    .set('nombres', this.forma.value.nombrecompleto.nombre)
    .set('apellidos', this.forma.value.nombrecompleto.apellido)
    .set('password', this.forma.value.password1)
    .set('passwordVerif', this.forma.value.password2)
    .set('tipoUsuario', '1')
    .set('fecha', '2019-01-01 00:00:00');
    this.signupServ.checkLogin(this.values).subscribe(resp => {
      console.log(resp)
    })
  }

  existeUsuario(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise(
      (resolve, reject) => {
        setTimeout(() => {
          if (control.value === 'strider') {
            resolve({ existe: true });
          } else {
            resolve(null);
          }
        }, 3000);

      });

    return promise;
  }

  noEstrada(control: FormControl): { [s: string]: boolean } {
    if (control.value === 'Estrada') {
      return {
        noEstrada: true
      };
    }
    return null;
  }
  noIgual(control: FormControl): { [s: string]: boolean } {
    const forma: any = this;
    if (control.value !== forma.controls.password1.value) {
      return {
        noiguales: true
      };
    }
    return null;
  }

  agregarPasatiempo() {
    (this.forma.controls.pasatiempos as FormArray).push(
      new FormControl('', Validators.required)
    );
  }

}