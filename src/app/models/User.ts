export interface UserLogin{
  id:number,
  email: string
  password: string
}

export interface AuthenticateUser{
  email: string
  authCode: string
}

export interface UserRegister{
  firstName:string,
  middleName:string,
  lastName:string,
  email: string
  password: string
  rol: string
  authenticated: boolean
  authCode: string
}

export interface UserTable{
  id:number,
  email: string
  rol: string
  auth: boolean
  speciality: string
  hSpeciality: string
  status:boolean
}

export interface UserTableEdit{
  id:number,
  email: string
  rol: string
  auth: boolean
  speciality: string
  hSpeciality: string
  status:boolean
  statusString?:string
}
