DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    product_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NULL;
    department_name VARCHAR(255) NUll;
    price DECIMAL(7,2) NULL;
    stock_quantity INT NULL;
    PRIMARY KEY (product_id);
);


INSERT INTO bamazon_db (product_name, department_name, price, stock_quantity) VALUES 
("Shoes", "Clothing",10,25);
