package com.localservicefinder.dto;

public class DashboardStatsDto {
    private long totalUsers;
    private long totalProviders;
    private long totalServices;
    private long totalBookings;
    private long pendingApprovals;
    private long completedBookings;
    private long pendingBookings;
    private long acceptedBookings;
    private long cancelledBookings;
    private double averageRating;

    public DashboardStatsDto() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalProviders() {
        return totalProviders;
    }

    public void setTotalProviders(long totalProviders) {
        this.totalProviders = totalProviders;
    }

    public long getTotalServices() {
        return totalServices;
    }

    public void setTotalServices(long totalServices) {
        this.totalServices = totalServices;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getPendingApprovals() {
        return pendingApprovals;
    }

    public void setPendingApprovals(long pendingApprovals) {
        this.pendingApprovals = pendingApprovals;
    }

    public long getCompletedBookings() {
        return completedBookings;
    }

    public void setCompletedBookings(long completedBookings) {
        this.completedBookings = completedBookings;
    }

    public long getPendingBookings() {
        return pendingBookings;
    }

    public void setPendingBookings(long pendingBookings) {
        this.pendingBookings = pendingBookings;
    }

    public long getAcceptedBookings() {
        return acceptedBookings;
    }

    public void setAcceptedBookings(long acceptedBookings) {
        this.acceptedBookings = acceptedBookings;
    }

    public long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }
}
