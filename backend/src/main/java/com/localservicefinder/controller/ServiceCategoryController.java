package com.localservicefinder.controller;

import com.localservicefinder.dto.ApiResponse;
import com.localservicefinder.entity.ServiceCategory;
import com.localservicefinder.service.ServiceCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Service Categories REST Controller:
 * GET /api/services
 * GET /api/services/{id}
 * POST /api/services
 * PUT /api/services/{id}
 * DELETE /api/services/{id}
 */
@RestController
@RequestMapping("/api/services")
public class ServiceCategoryController {

    private final ServiceCategoryService categoryService;

    public ServiceCategoryController(ServiceCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceCategory>>> getAllCategories() {
        List<ServiceCategory> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories fetched successfully", categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceCategory>> getCategoryById(@PathVariable Long id) {
        ServiceCategory category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category fetched successfully", category));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceCategory>> createCategory(@RequestBody ServiceCategory category) {
        ServiceCategory saved = categoryService.createCategory(category);
        return new ResponseEntity<>(ApiResponse.success("Category created successfully", saved), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceCategory>> updateCategory(@PathVariable Long id, @RequestBody ServiceCategory category) {
        ServiceCategory updated = categoryService.updateCategory(id, category);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully"));
    }
}
