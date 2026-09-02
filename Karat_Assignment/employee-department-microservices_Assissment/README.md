# Employee-Department Microservices

Assignment implementation:
- Eureka Server: 8761
- API Gateway: 8080
- Department Service: 8081
- Employee Service: 8082

## Prerequisites
- Java 17
- Maven 3.8+
- PostgreSQL
- Database named company_db

Create database:
CREATE DATABASE company_db;

Update PostgreSQL username/password in:
- employee-service/src/main/resources/application.properties
- department-service/src/main/resources/application.properties

## Run order
1. EurekaServerApplication
2. EmployeeServiceApplication
3. DepartmentServiceApplication
4. ApiGatewayApplication

Open Eureka:
http://localhost:8761

## Postman
POST http://localhost:8080/departments
{
  "departmentName": "IT",
  "location": "Delhi"
}

POST http://localhost:8080/employees
{
  "employeeName": "Rahul",
  "email": "rahul@gmail.com",
  "salary": 60000,
  "departmentId": 1
}

POST http://localhost:8080/employees
{
  "employeeName": "Amit",
  "email": "amit@gmail.com",
  "salary": 55000,
  "departmentId": 1
}

GET http://localhost:8080/employees/department/1

GET http://localhost:8080/departments/1/employees
