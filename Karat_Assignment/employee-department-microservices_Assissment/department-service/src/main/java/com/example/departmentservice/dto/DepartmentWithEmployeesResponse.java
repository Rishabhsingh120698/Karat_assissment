package com.example.departmentservice.dto;

import java.util.List;

public class DepartmentWithEmployeesResponse {

    private Long departmentId;
    private String departmentName;
    private String location;
    private List<EmployeeDto> employees;

    public DepartmentWithEmployeesResponse() {}

    public DepartmentWithEmployeesResponse(Long departmentId, String departmentName,
                                            String location, List<EmployeeDto> employees) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.location = location;
        this.employees = employees;
    }

    public Long getDepartmentId() { return departmentId; }
    public String getDepartmentName() { return departmentName; }
    public String getLocation() { return location; }
    public List<EmployeeDto> getEmployees() { return employees; }

    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public void setLocation(String location) { this.location = location; }
    public void setEmployees(List<EmployeeDto> employees) { this.employees = employees; }
}
