package com.localservicefinder.service;

import com.localservicefinder.entity.ServiceCategory;
import com.localservicefinder.exception.BadRequestException;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.ServiceCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceCategoryService {

    private final ServiceCategoryRepository categoryRepository;

    public ServiceCategoryService(ServiceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<ServiceCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public ServiceCategory getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service Category not found with id: " + id));
    }

    @Transactional
    public ServiceCategory createCategory(ServiceCategory category) {
        if (categoryRepository.findByNameIgnoreCase(category.getName().trim()).isPresent()) {
            throw new BadRequestException("Category with name '" + category.getName() + "' already exists.");
        }
        category.setName(category.getName().trim());
        return categoryRepository.save(category);
    }

    @Transactional
    public ServiceCategory updateCategory(Long id, ServiceCategory updated) {
        ServiceCategory existing = getCategoryById(id);
        existing.setName(updated.getName().trim());
        existing.setDescription(updated.getDescription());
        if (updated.getIcon() != null && !updated.getIcon().isBlank()) {
            existing.setIcon(updated.getIcon());
        }
        return categoryRepository.save(existing);
    }

    @Transactional
    public void deleteCategory(Long id) {
        ServiceCategory existing = getCategoryById(id);
        categoryRepository.delete(existing);
    }
}
