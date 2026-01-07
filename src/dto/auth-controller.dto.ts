export interface LogoutBody {
    refresh_token:string;
}
export interface RefreshLoginBody {
    refresh_token:string;
}
export interface PasswordResetRequestBody {
    email:string;
}
export interface PasswordResetChangeBody {
    old_password:string;
    new_password:string;
    reset_token:string;
}