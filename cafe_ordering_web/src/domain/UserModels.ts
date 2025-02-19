import { jwtDecode } from "jwt-decode";

export class TokenDto {
  tokenValue: string = "";

  constructor(init?: Partial<TokenDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  static fromJson(json: Partial<TokenDto>): TokenDto {
    return new TokenDto({
      tokenValue: json.tokenValue ?? "",
    });
  }
}

interface DecodedToken {
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
  token?: TokenDto;
  email: string = "";
  roles: string[] = [];
  claims: Record<string, string> = {};

  constructor(init?: Partial<UserModel>) {
    if (init) {
      Object.assign(this, init);
    }
    const decoded: DecodedToken = this.token ? this.parseToken() : {};
    this.email = decoded.email ?? "";
    this.roles = decoded.role ?? [];
    this.claims = decoded.claims ?? {};
  }

  // Token geçerliliğini kontrol eder (expiration kontrolü)
  public isTokenValid(): boolean {
    try {
      if (!this.token) return false;
      const decoded = jwtDecode<{ exp: number }>(this.token.tokenValue);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error("Token decode hatası:", error);
      return false;
    }
  }

  // Token'ı decode edip, email, role ve diğer claim'leri döndürür.
  public parseToken(): DecodedToken {
    try {
      if (!this.token) return {};
      const decoded: any = jwtDecode(this.token.tokenValue);
      const email: string | undefined = decoded["email"];
      // "role" alanı tekil ya da dizi olabilir, bunu diziye çeviriyoruz.
      let role: string[] | undefined = undefined;
      if (decoded["role"]) {
        role = Array.isArray(decoded["role"]) ? decoded["role"] : [decoded["role"]];
      }
      // "exp", "iss", "aud", "email" ve "role" dışındaki tüm alanları claim olarak alıyoruz.
      const claims: Record<string, string> = {};
      Object.keys(decoded).forEach(key => {
        if (!["exp", "iss", "aud", "email", "role"].includes(key)) {
          // Herhangi bir değer, stringe çevrilerek claims'e ekleniyor.
          claims[key] = decoded[key]?.toString();
        }
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
