function generateInvoice(customerName, totalAmount) {
    console.log(`Invoice generated successfully for ${customerName}`);
    console.log(`Total Amount: ${totalAmount}`);
}

function placeOrder(
    customerName,
    productName,
    productPrice,
    quantity,
    callback
) {
    const totalAmount = productPrice * quantity;

    console.log("Customer:", customerName);
    console.log("Product:", productName);
    console.log("Price:", productPrice);
    console.log("Quantity:", quantity);
    console.log("Total Amount:", totalAmount);

    callback(customerName, totalAmount);
}

placeOrder(
    "Priya",
    "Laptop",
    50000,
    2,
    generateInvoice
);