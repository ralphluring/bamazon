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

function readAll(){
    let query = connection.query('SELECT * FROM products', function(err, response){
        if(err) throw err;
        console.table(response);
      });
}

function addNew(){
    inquirer.prompt([
        {
            name:"addName",
            type:"input",
            message:"Name of item"
        },
        {
            name:"addPrice",
            type:"input",
            message:"Price of item"
        },
        {
            name:"addDepartment",
            type:"input",
            message:"Which department>"
        },
        {
            name:"addStock",
            type:"input",
            message:"Stock Quantity"
        }
    ]).then(function(answer){
     let name = answer.addName;
     let department = answer.addDepartment;
     let price = answer.addPrice;
     let stock = answer.addStock;
     var sql = "INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ?";
     var values = [[`${name}`,`${department}`,`${price}`,`${stock}`]];
        let query = connection.query(sql,[values],function(err, response){
          if(err) throw err;
          console.log("Product Has been added to the database :) ");
          mainMenu();
      });  
    });
}

function viewLow(){
    let query = connection.query('SELECT * FROM products WHERE stock_quantity < 5',function(err, response){
        if(err) throw err;
        let lowP = JSON.stringify(response, null, 8)
        console.log(lowP);
    });
}

function addInv(){
    let query = connection.query('SELECT product_id, product_name FROM products',function(err,res){
        if(err) throw err;
        let inventoryArr = [];
        console.log(inventoryArr);
        res.forEach(element => {
            let inventoryChoice = element.product_id + "-" + element.product_name;
            inventoryArr.push(inventoryChoice);
        });
        inquirer.prompt([
            {
                name:'updateItem',
                type:'list',
                message:'Which Item do you need to update',
                choices: inventoryArr
            }
        ]).then(function(answer){
            let item = answer.updateItem.split("-");
            let queryItem = parseInt(item[0]);
            let query = connection.query(`SELECT * FROM products WHERE product_id = ${queryItem}`,function(err,res){
                console.log("You are updating product id #: " + res[0].product_id + " - name : " + res[0].product_name + " - the current stock is: " + res[0].stock_quantity)
                inquirer.prompt([
                    {
                        name:"updateQty",
                        type:"input",
                        message:"What is the new Stock Quantity"
                    }
                ]).then(function(answer){
                    console.log("updating product id #: " + queryItem + " stock qty to: " + answer.updateQty);
                   
                    let query = connection.query("UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: answer.updateQty
                      },
                      {
                        product_id: queryItem
                      }
                    ],
                    function(err,res){
                        if(err)throw err;
                        console.log("product updated :) ");
                        mainMenu();
                    })
                })
            })
        });      
    })
}

function mainMenu(){
    inquirer
    .prompt([{
        name: "main",
        type: "list",
        message: "MAIN MENU",
        choices:["View Products for Sale","View Low Inventory","Add to Inventory", "Add New Product","exit"]
    }]).then(function(answer) {
        switch (answer.main) {
            case "View Products for Sale":
                readAll();
                mainMenu();
                break;
            case "Add New Product":
                addNew();
               
                break;
            case "View Low Inventory":
                viewLow();
                mainMenu();
                break;
            case "Add to Inventory":
                addInv();
                
                break;
            case "exit":
                connection.end();
                break;
        }  
       
    });  
}











