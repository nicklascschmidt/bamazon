var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("---- Lieutenant, we are connected. ----");
    start();
});

// global variables
var userChoice;
var string;
var product;
var productId;
var productName;
var productPrice;
var productQuantity;
var string;
var productArray = [];
var userProductChoice;
var userProductQuantity;
var totalQuantity;


function start() {
    console.log("oh we're running baby");
    inquirer.prompt([
        {
        name: "menuOptions",
        message: "Choose one.",
        type: "list",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }
    ]).then(function(data) {
        userChoice = data.menuOptions;
        if (userChoice === "View Products for Sale") {
            viewProducts();
            connection.end(); // ends SQL connection
        } else if (userChoice === "View Low Inventory") {
            viewInventory();
            connection.end(); // ends SQL connection
        } else if (userChoice === "Add to Inventory") {
            addInventory();
        } else if (userChoice === "Add New Product") {
            addProduct();
        } else {
            console.log("something went completely amiss");
        }

    }); // end prompt

    
} // end start()



// `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProducts() {
    console.log("viewProducts running");
    connection.query(
        "SELECT * FROM products",
        function(error, results, fields) {
            if (error) throw error;

            console.log("Available Products:");
            for (var n=0; n < results.length; n++) {
                product = results[n];
                productId = product.item_id;
                productName = product.product_name;
                productPrice = parseInt(product.price);
                productQuantity = parseInt(product.stock_quantity);

                string = productId + " | " + productName + " | $" + productPrice + " | " + productQuantity;
                console.log(string);
            }
        } // close callback func
    ); // close SQL query
    // setTimeout(userPrompt,1000 * .1); // doesn't run until displayProducts() finishes printing to console
} // close viewProducts()

// `View Low Inventory`, then it should list all items with an inventory count lower than five.
function viewInventory() {
    console.log("viewInventory running");
    connection.query(
        "SELECT * FROM products WHERE stock_quantity < 5",
        function(error, results) {
            if (error) throw error;

            for (var n=0; n < results.length; n++) {
                product = results[n];
                productId = product.item_id;
                productName = product.product_name;
                productPrice = parseInt(product.price);
                productQuantity = parseInt(product.stock_quantity);

                string = productId + " | " + productName + " | $" + productPrice + " | " + productQuantity;
                console.log(string);
            }            
        }
    ) // close SQL query
} // close viewInventory()

// `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory() {
    console.log("addInventory running");

    // get product names from database
    connection.query(
        "SELECT * FROM products",
        function(error,results) {
            if (error) throw err;

            for (var n=0; n < results.length; n++) {
                product = results[n];
                productArray.push(product.product_name);
            }
            askProductName();
        }
    ) // close SQL query
    
    // ask user to pick a product to add stock to
    function askProductName() {
        inquirer.prompt([
            {
                name: "addInventory",
                message: "What item do you want to add stock for?",
                type: "list",
                choices: productArray
            }
        ]).then(function(data) {
            userProductChoice = data.addInventory;

            askStockAmount();

        }); // close prompt
    } // close askProductName()

    // ask user how many units they want to add
    function askStockAmount() {
        inquirer.prompt([
            {
                name: "addStockAmount",
                message: "How many units do you want to add?",
                type: "input"
            }
        ]).then(function(data) {
            addStockAmount = parseInt(data.addStockAmount);

            getStock();

        }); // close prompt
    } // close askStockAmount()

    // get # of units and add the units via SQL
    function getStock() {
        connection.query(
            "SELECT * FROM products WHERE product_name = ?",
            [userProductChoice],
            function(error,results,fields) {
                if (error) throw error;
                userProductQuantity = parseInt(results[0].stock_quantity);
                totalQuantity = userProductQuantity + addStockAmount;

                updateDatabase();
            }
        ) // close SQL query

        function updateDatabase() {
            connection.query(
                "UPDATE products SET stock_quantity = ? WHERE product_name = ?",
                [totalQuantity , userProductChoice],
                function(error, results, fields) {
                    if (error) throw error;
                    console.log(userProductChoice + " stock updated!");
                }
            ) // close SQL query
            connection.end(); // ends SQL connection
        }
    } // close getStock()
} // close addInventory()


// `Add New Product`, it should allow the manager to add a completely new product to the store.
function addProduct() {
    console.log("addProduct running");
}



