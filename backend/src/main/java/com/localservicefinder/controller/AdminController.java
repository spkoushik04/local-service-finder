package com.localservicefinder.controller;

import com.localservicefinder.dto.ApiResponse;
import com.localservicefinder.dto.DashboardStatsDto;
import com.localservicefinder.dto.ProviderResponseDto;
import com.localservicefinder.entity.User;
import com.localservicefinder.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin REST Controller:
 * GET /api/admin/users
 * GET /api/admin/providers
 * PUT /api/admin/providers/{id}/approve
 * PUT /api/admin/providers/{id}/reject
 * DELETE /api/admin/users/{id}
 * GET /api/admin/stats
 * GET /api/admin/stats/customer/{customerId}
 * GET /api/admin/stats/provider/{providerId}
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users retrieved", users));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> getAllProviders() {
        List<ProviderResponseDto> providers = adminService.getAllProviders();
        return ResponseEntity.ok(ApiResponse.success("All providers retrieved", providers));
    }

    @PutMapping("/providers/{id}/approve")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> approveProvider(@PathVariable Long id) {
        ProviderResponseDto approved = adminService.approveProvider(id);
        return ResponseEntity.ok(ApiResponse.success("Provider approved successfully", approved));
    }

    @PutMapping("/providers/{id}/reject")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> rejectProvider(@PathVariable Long id) {
        ProviderResponseDto rejected = adminService.rejectProvider(id);
        return ResponseEntity.ok(ApiResponse.success("Provider status set to rejected", rejected));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getAdminStats() {
        DashboardStatsDto stats = adminService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success("Admin stats retrieved", stats));
    }

    @GetMapping("/stats/customer/{customerId}")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getCustomerStats(@PathVariable Long customerId) {
        DashboardStatsDto stats = adminService.getCustomerStats(customerId);
        return ResponseEntity.ok(ApiResponse.success("Customer stats retrieved", stats));
    }

    @GetMapping("/stats/provider/{providerId}")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getProviderStats(@PathVariable Long providerId) {
        DashboardStatsDto stats = adminService.getProviderStats(providerId);
        return ResponseEntity.ok(ApiResponse.success("Provider stats retrieved", stats));
    }
}
