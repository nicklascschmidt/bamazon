
var inquirer = require("inquirer");

// 'VALUES ("guitar","instruments",180,30);'

var stringArray = [];
function askQ() {
    inquirer.prompt([
        {
            name: "product",
            message: "product?",
            type: "input"
        },
        {
            name: "department",
            message: "department?",
            type: "input"
        },
        {
            name: "price",
            message: "price?",
            type: "input"
        },
        {
            name: "amount",
            message: "amount?",
            type: "input"
        }
    ]).then(function(data) {
        var product = data.product;
        var department = data.department;
        var price = parseInt(data.price);
        var amount = parseInt(data.amount);

        var string = 'INSERT INTO products (product_name, department_name, price, stock_quantity)\nVALUES ("' + product + '","' + department + '",' + price + ',' + amount + ');\n'
        stringArray.push(string);

        n++;

        // runs the callback
        callback();
    });
};

var n = 0;
function callback() {
    if (n < 10) {
        askQ();
    } else {
        console.log(stringArray.join("\n"));
    }
}

callback();




