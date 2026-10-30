import { session, login, logout, api, refresh } from './session';
export type UserRole='user'|'admin';
export interface User {
  id:string; name:string; email:string; role:UserRole; department?:string; createdAt:Date; lastLogin?:Date;
}
export default class AuthService {
  static login=login;
  static logout=logout;
  static getCurrentUser():User|null { return session.get().user; }
  static isAdmin() {return this.getCurrentUser()?.role==='admin';}
  static isUser() {return this.getCurrentUser()?.role==='user';}
  static getAllUsers():User[] {return session.get().users;}
  static async deleteUser(id:string) {await api(`/members/${encodeURIComponent(id)}`,'DELETE');await refresh();}
}
