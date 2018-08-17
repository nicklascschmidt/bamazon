var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("---- Lieutenant, we are connected. ----");
    start();
});

// Global variables
var string;
var product;
var productId;
var productName;
var productDepartment;
var productPrice;
var productQuantity;
var userIdInput;
var userQuantityInput;
var productQuantityAvailable;
var orderAmount;

function start() {
    displayProducts();
};

function displayProducts() {
    connection.query(
        // "SELECT * FROM products WHERE product_name = ?", ["guitar"], function(error, results, fields) {
        "SELECT * FROM products",
        function(error, results, fields) {
            if (error) throw error;

            // console.log("--- results ---",results);
            
            // var productArray = [];
            // for (var n=0; n < results.length; n++) {
            //     productArray.push(product);
            // }

            console.log("Available Products:");
            for (var n=0; n < results.length; n++) {
                product = results[n];
                productId = product.item_id;
                productName = product.product_name;
                productPrice = parseInt(product.price);
                string = productId + " | " + productName + " | $" + productPrice;
                console.log(string);
            }
        } // close callback func
    ); // close SQL query
    setTimeout(userPrompt,1000 * .01); // doesn't run until displayProducts() finishes printing to console
}; // close displayProducts()


function userPrompt() {
    inquirer.prompt([
        {
            name: "userPromptId",
            message: "What's the ID of the product you'd like to buy?",
            type: "input"
        },
        {
            name: "userPromptUnitAmount",
            message: "How many would you like to buy?",
            type: "input"
        }
    ]).then(function(answers) {
        userIdInput = parseInt(answers.userPromptId);
        userQuantityInput = parseInt(answers.userPromptUnitAmount);

        checkAvailability();
    });

} // close userPrompt()


function checkAvailability() {
    connection.query(
        "SELECT * FROM products WHERE item_id = ?",
        [userIdInput],
        function(error, results, fields) {
            if (error) throw error;

            // console.log("----- results -----",results);
            product = results[0];
            productName = product.product_name;
            productDepartment = product.department_name;
            productPrice = product.price;
            productQuantityAvailable = product.stock_quantity;

            if (productQuantityAvailable >= userQuantityInput) {
                console.log("Sweet, we have enough!");
                // order goes through
                fulfillOrder();
            } else {
                console.log("Insufficient quantity! Come back next time loser.");
                // order doesn't go through
            }
        }

    ) // close SQL query
} // close checkAvailability()


function fulfillOrder() {
    // get the amount of product remaining
    var remainingStock = productQuantityAvailable - userQuantityInput;

    connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
        [remainingStock,userIdInput],
        function(error,results,fields) {
            if (error) throw error;
        }
    ); // close SQL query

    calculateOrder();
    connection.end(); // end the SQL connection
}

function calculateOrder() {
    // show how much the order costs
    orderAmount = productPrice * userQuantityInput;
    console.log("Your order total is $" + orderAmount);
}



