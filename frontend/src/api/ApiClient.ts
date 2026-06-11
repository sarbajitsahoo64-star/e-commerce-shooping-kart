/** Simulates an HTTP client with network latency — mirrors RestTemplate / WebClient in Spring Boot */

export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
  timestamp: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}

function timestamp(): string {
  return new Date().toISOString();
}

function ok<T>(data: T, message = "OK"): ApiResponse<T> {
  return { status: 200, data, message, timestamp: timestamp() };
}

function created<T>(data: T): ApiResponse<T> {
  return { status: 201, data, message: "Created", timestamp: timestamp() };
}

function notFound(resource: string): never {
  throw { status: 404, error: "Not Found", message: `${resource} not found`, timestamp: timestamp() } as ApiError;
}

function conflict(message: string): never {
  throw { status: 409, error: "Conflict", message, timestamp: timestamp() } as ApiError;
}

function unauthorized(message = "Invalid credentials"): never {
  throw { status: 401, error: "Unauthorized", message, timestamp: timestamp() } as ApiError;
}

function badRequest(message: string): never {
  throw { status: 400, error: "Bad Request", message, timestamp: timestamp() } as ApiError;
}

/** Simulates network latency (80–250 ms) */
async function delay(min = 80, max = 250): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min) + min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const HttpClient = { ok, created, notFound, conflict, unauthorized, badRequest, delay };
