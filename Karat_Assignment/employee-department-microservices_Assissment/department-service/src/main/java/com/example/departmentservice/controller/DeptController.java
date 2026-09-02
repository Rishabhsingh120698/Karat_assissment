package com.example.departmentservice.controller;

import com.example.departmentservice.dto.DepartmentWithEmployeesResponse;
import com.example.departmentservice.entity.Department;
import com.example.departmentservice.service.DepartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentService service;

    public DepartmentController(DepartmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Department> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Department getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Department create(@RequestBody Department department) {
        return service.save(department);
    }

    @GetMapping("/{departmentId}/employees")
    public DepartmentWithEmployeesResponse getDepartmentWithEmployees(
            @PathVariable Long departmentId) {
        return service.getDepartmentWithEmployees(departmentId);
    }
}
