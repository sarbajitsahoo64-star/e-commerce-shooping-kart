import { HttpClient, type ApiResponse } from "../api/ApiClient";
import { User } from "../models/User";
import type { AuthResponse, LoginRequest, SignupRequest, UserDTO } from "../models/User";
import { UserRepository } from "../repository/UserRepository";

const SESSION_KEY = "shopkart_session";

function generateToken(user: User): string {
  // Simulated JWT — in production this would be a signed JWT from Spring Security
  const payload = btoa(JSON.stringify({ sub: user.getId(), email: user.getEmail(), iat: Date.now() }));
  return `eyJ0eXBlIjoiSldUIn0.${payload}.shopkart_sig`;
}

/** @Service — mirrors Spring Boot @Service UserService / AuthService */
export class UserService {
  static async login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    await HttpClient.delay(200, 500);

    if (!request.email || !request.password) {
      HttpClient.badRequest("Email and password are required");
    }

    const user = UserRepository.findByEmail(request.email);
    if (!user || !user.validatePassword(request.password)) {
      HttpClient.unauthorized("Invalid email or password");
    }

    const token = generateToken(user!);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const response: AuthResponse = { user: user!.toDTO(), token, expiresAt };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(response));
    return HttpClient.ok(response, "Login successful");
  }

  static async signup(request: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    await HttpClient.delay(300, 600);

    if (!request.name || !request.email || !request.password) {
      HttpClient.badRequest("Name, email and password are required");
    }
    if (request.password !== request.confirmPassword) {
      HttpClient.badRequest("Passwords do not match");
    }
    if (request.password.length < 6) {
      HttpClient.badRequest("Password must be at least 6 characters");
    }
    if (UserRepository.existsByEmail(request.email)) {
      HttpClient.conflict(`Account already exists for ${request.email}`);
    }

    const user = new User({
      name: request.name,
      email: request.email,
      phone: request.phone ?? "",
      password: request.password,
    });
    UserRepository.save(user);

    const token = generateToken(user);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const response: AuthResponse = { user: user.toDTO(), token, expiresAt };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(response));
    return HttpClient.ok(response, "Account created successfully");
  }

  static logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
  }

  static getSession(): AuthResponse | null {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw) as AuthResponse;
      if (new Date(session.expiresAt) < new Date()) {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  static async getProfile(userId: string): Promise<ApiResponse<UserDTO>> {
    await HttpClient.delay(100, 200);
    const user = UserRepository.findById(userId);
    if (!user) HttpClient.notFound(`User #${userId}`);
    return HttpClient.ok(user!.toDTO());
  }
}
