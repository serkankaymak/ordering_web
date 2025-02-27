import { th } from "date-fns/locale";
import { jwtDecode } from "jwt-decode";

export class TokenDto {
  claimsToken: string = "";
  identityToken: string = "";

  constructor(init?: Partial<TokenDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  static fromJson(json: Partial<TokenDto>): TokenDto {
    return new TokenDto({
      claimsToken: json.claimsToken ?? "",
      identityToken: json.identityToken ?? "",
    });
  }
}

interface DecodedToken {
  id?: number;
  email?: string;
  role?: string[];
  claims?: Record<string, string>;
  exp?: number;

}

export enum UserRolesEnum {
  SystemAdministrator = "SystemAdministrator", // developer
  Admin = "Admin",               // admin
  Member = "Member"              // member
}

export enum RoleClaimsEnum {
  CanViewAdminDashboard = "CanViewAdminDashboard",
  CanCreateProducts = "CanCreateProducts",
  CanUpdateProducts = "CanUpdateProducts",
  CanCreateDiscounts = "CanCreateDiscounts",
  CanUpdateDiscounts = "CanUpdateDiscounts"
}

export class UserModel {
  id: number = 0;
  token?: TokenDto;
  email: string = "";
  roles: string[] = [];
  claims: Record<string, string> = {};

  constructor(init?: Partial<UserModel>) {
    if (init) {
      Object.assign(this, init);
    }
    const decoded: DecodedToken = this.token ? this.parseToken() : {};
    this.id = decoded.id ?? 0;
    this.email = decoded.email ?? "";
    this.roles = decoded.role ?? [];
    this.claims = decoded.claims ?? {};
  }

  // Token geçerliliğini kontrol eder (expiration kontrolü)
  public isTokenValid(): boolean {
    try {
      if (!this.token) return false;
      const decoded = jwtDecode<{ exp: number }>(this.token.claimsToken);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error("Token decode hatası:", error);
      return false;
    }
  }

  // Token'ı decode edip, email, role ve diğer claim'leri döndürür.
  public parseToken(): DecodedToken {
    try {
      console.log(this);
      if (!this.token) return {};
      const decoded: any = jwtDecode(this.token.claimsToken);
      const emailKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

      const email: string | undefined = decoded[emailKey];
      // "role" alanı tekil ya da dizi olabilir, bunu diziye çeviriyoruz.
      let role: string[] | undefined = undefined;
      const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      if (decoded[roleKey]) {
        role = Array.isArray(decoded[roleKey]) ? decoded[roleKey] : [decoded[roleKey]];
      }
      // "exp", "iss", "aud", "email" ve "role" dışındaki tüm alanları claim olarak alıyoruz.
      const claims: Record<string, string> = {};
      Object.keys(decoded).forEach(key => {
        claims[key] = decoded[key]?.toString();
      });
      return { email, role, claims, exp: decoded["exp"] };
    } catch (error) {
      console.error("Token decode edilirken hata oluştu:", error);
      return {};
    }
  }

  public isAdmin(): boolean {
    return this.roles.includes(UserRolesEnum.Admin);
  }

  public isDeveloper(): boolean {
    return this.roles.includes(UserRolesEnum.SystemAdministrator);
  }

  public canChangeSitePreferences(): boolean {
    return this.isAdmin() || this.isDeveloper();
  }

  public canViewAdminPanel(): boolean {
    return this.claims[RoleClaimsEnum.CanViewAdminDashboard] === "true";
  }
}
