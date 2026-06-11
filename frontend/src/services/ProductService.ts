import { HttpClient, type ApiResponse } from "../api/ApiClient";
import type { ProductDTO } from "../models/Product";
import { ProductRepository } from "../repository/ProductRepository";

/** @Service — mirrors Spring Boot @Service ProductService */
export class ProductService {
  static async findAll(): Promise<ApiResponse<ProductDTO[]>> {
    await HttpClient.delay();
    const products = ProductRepository.findAll().map((p) => p.toDTO());
    return HttpClient.ok(products);
  }

  static async findById(id: number): Promise<ApiResponse<ProductDTO>> {
    await HttpClient.delay();
    const product = ProductRepository.findById(id);
    if (!product) HttpClient.notFound(`Product #${id}`);
    return HttpClient.ok(product!.toDTO());
  }

  static async search(category: string, query: string): Promise<ApiResponse<ProductDTO[]>> {
    await HttpClient.delay(50, 150);
    const results = ProductRepository.findByCategoryAndNameContaining(category, query);
    return HttpClient.ok(results.map((p) => p.toDTO()));
  }

  static async getCategories(): Promise<ApiResponse<string[]>> {
    await HttpClient.delay(30, 80);
    return HttpClient.ok(ProductRepository.findAllCategories());
  }

  static async findByCategory(category: string): Promise<ApiResponse<ProductDTO[]>> {
    await HttpClient.delay();
    const products =
      category === "All"
        ? ProductRepository.findAll()
        : ProductRepository.findByCategory(category);
    return HttpClient.ok(products.map((p) => p.toDTO()));
  }
}
