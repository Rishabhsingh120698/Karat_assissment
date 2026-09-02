package com.example.departmentservice.client;

import com.example.departmentservice.dto.EmployeeDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "EMPLOYEE-SERVICE")
public interface EmployeeClient {

    @GetMapping("/employees/department/{departmentId}")
    List<EmployeeDto> getEmployeesByDepartment(@PathVariable("departmentId") Long departmentId);
}
