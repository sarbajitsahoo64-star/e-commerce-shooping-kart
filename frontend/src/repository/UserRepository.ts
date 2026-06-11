import { User, type UserDTO } from "../models/User";

/** In-memory store — mirrors a Spring Data JPA UserRepository */
export class UserRepository {
  private static users: Map<string, User> = new Map();

  static save(user: User): User {
    this.users.set(user.getEmail(), user);
    return user;
  }

  static findByEmail(email: string): User | null {
    return this.users.get(email) ?? null;
  }

  static findById(id: string): User | null {
    for (const user of this.users.values()) {
      if (user.getId() === id) return user;
    }
    return null;
  }

  static existsByEmail(email: string): boolean {
    return this.users.has(email);
  }

  static count(): number {
    return this.users.size;
  }

  static findAll(): UserDTO[] {
    return Array.from(this.users.values()).map((u) => u.toDTO());
  }
}
