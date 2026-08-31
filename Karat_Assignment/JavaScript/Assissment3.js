const calculateSalary = function(employeeName, basicSalary, bonusPercentage) {

    const bonusAmount = (basicSalary * bonusPercentage) / 100;
    const finalSalary = basicSalary + bonusAmount;

    return {
        employeeName,
        basicSalary,
        bonusAmount,
        finalSalary
    };
};

const result = calculateSalary("Rahul", 50000, 10);

console.log(result);