-- DROP DATABASE IF EXISTS bamazon_DB;
-- CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

-- columns:
--    * item_id (unique id for each product)
--    * product_name (Name of product)
--    * department_name
--    * price (cost to customer)
--    * stock_quantity (how much of the product is available in stores)


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("guitar","instruments",180,30);
-- see file.js


-- for cleanup
USE bamazon_DB;
DELETE FROM products
WHERE item_id > 10;









