const calculateGrade = (marks) => {

    const total = marks.reduce((sum, mark) => sum + mark, 0);

    const average = total / marks.length;

    let grade;

    if (average >= 90)
        grade = "A";
    else if (average >= 75)
        grade = "B";
    else if (average >= 60)
        grade = "C";
    else if (average >= 40)
        grade = "D";
    else
        grade = "Fail";

    return {
        total,
        average,
        grade
    };
};

console.log(calculateGrade([80, 90, 85, 95]));
