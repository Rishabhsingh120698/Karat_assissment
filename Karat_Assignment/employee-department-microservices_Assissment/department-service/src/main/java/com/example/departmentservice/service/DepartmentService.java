package com.example.departmentservice.service;

import com.example.departmentservice.client.EmployeeClient;
import com.example.departmentservice.dto.DepartmentWithEmployeesResponse;
import com.example.departmentservice.dto.EmployeeDto;
import com.example.departmentservice.entity.Department;
import com.example.departmentservice.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeClient employeeClient;

    public DepartmentService(DepartmentRepository departmentRepository,
                             EmployeeClient employeeClient) {
        this.departmentRepository = departmentRepository;
        this.employeeClient = employeeClient;
    }

    public List<Department> getAll() {
        return departmentRepository.findAll();
    }

    public Department getById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found: " + id));
    }

    public Department save(Department department) {
        return departmentRepository.save(department);
    }

    public DepartmentWithEmployeesResponse getDepartmentWithEmployees(Long departmentId) {
        Department department = getById(departmentId);

        List<EmployeeDto> employees =
                employeeClient.getEmployeesByDepartment(departmentId);

        return new DepartmentWithEmployeesResponse(
                department.getId(),
                department.getDepartmentName(),
                department.getLocation(),
                employees
        );
    }
}
