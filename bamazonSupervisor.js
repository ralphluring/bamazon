var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "#Cb06250915",
    database: "bamazon_db"
  });
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    mainMenu();
});


function departmentView(){
    let query = connection.query(
        'SELECT COUNT(product_sales) FROM products GROUP BY department_name ORDER BY COUNT(product_sales) DESC ',
    function(err,res){
        console.table(res);
    })
   
}

function newDepartment(){
    console.log("create a new department")
}

function mainMenu(){
    inquirer
    .prompt([{
        name: "main",
        type: "list",
        message: "MAIN MENU",
        choices:["View Product Sales by Department","Create New Department"]
    }]).then(function(answer) {
        switch (answer.main) {
            case "View Product Sales by Department":
                departmentView();
                break;
            case "Create New Department":
                newDepartment();
                break;
        }  
    });  
}