/** Java-style Entity — mirrors a Spring Boot @Entity / UserDetails class */
export class User {
  private id: string;
  private name: string;
  private email: string;
  private phone: string;
  private passwordHash: string;
  private createdAt: Date;
  private role: UserRole;

  constructor(data: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
  }) {
    this.id = data.id ?? `USR-${Date.now()}`;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.passwordHash = this.hashPassword(data.password);
    this.createdAt = new Date();
    this.role = data.role ?? UserRole.CUSTOMER;
  }

  private hashPassword(password: string): string {
    // Simulated hash — in production this would be bcrypt
    return btoa(password + "_shopkart_salt");
  }

  validatePassword(password: string): boolean {
    return this.passwordHash === btoa(password + "_shopkart_salt");
  }

  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
  getPhone(): string { return this.phone; }
  getRole(): UserRole { return this.role; }
  getCreatedAt(): Date { return this.createdAt; }

  toDTO(): UserDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      createdAt: this.createdAt.toISOString(),
    };
  }
}

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: UserDTO;
  token: string;
  expiresAt: string;
}
