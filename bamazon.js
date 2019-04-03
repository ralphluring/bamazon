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
    startInq();
});

function readProducts(){
    console.log("Current Products\n");
    let query = connection.query("SELECT product_id,product_name,price FROM products",function(err,res){
        if(err) throw err;
        console.table(res);
    })
}

function showOrder(itemChoice,itemqty){
    let query = connection.query("SELECT department_name,product_name,price FROM products WHERE ?",
    [{
        product_id:itemChoice
    }],
    function(err,res){
        if(err) throw err;
        let total = itemqty * res[0].price;
            console.table([
                {
                    product_id:itemChoice,
                    item_name:res[0].product_name,
                    price:res[0].price,
                    quantity:itemqty,
                    total:total
                }
            ]);
            let query = connection.query("UPDATE products SET ? WHERE ?",
        [{
            product_sales: itemqty * res[0].price
        },
        {
            product_id:itemChoice
        }],
        function(err,res){
        if(err) throw err;
        // console.log(res);
    })
    }
    )
    
}

function updateInventory(itemChoice,newInventory,itemqty){
    console.log("Placing Order ... ");
    let query = connection.query("UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: newInventory
        },
        {
            product_id:itemChoice
        }],
        function(err,res){
        if(err) throw err;
        // console.log(res);
    })
    showOrder(itemChoice,itemqty);
    
    
}

function checkInventory(itemChoice,itemqty){
    console.log("Checking inventory...");
    let query = connection.query("SELECT stock_quantity FROM products WHERE ?",
        [{
            product_id:itemChoice
        }],
        function(err,res){
            if(err) throw err;
            // console.log(res[0].stock_quantity)    
            if(res[0].stock_quantity < itemqty){
                console.log("Sorry We only have " +res[0].stock_quantity  + " of those left!");
                connection.end();
            }else{
                let newInventory = res[0].stock_quantity - itemqty;    
                updateInventory(itemChoice,newInventory,itemqty);
                console.log("Your Order has Been Submitted");
                
            }
 
        }
    );
    
}

function startInq(){
    readProducts();
    let query = connection.query("SELECT product_id FROM products",function(err,productIds){
        if(err) throw err;
        let productIdArr = []
        for(let i = 0; i < productIds.length;i++){
           productIdArr.push(productIds[i].product_id.toString()) ;
        }
        inquirer
        .prompt(
        [{
          name: "itemChoice",
          type: "list",
          message: "Which item do you want to buy?",
          choices:productIdArr
        },
        {
            name: "itemqty",
            type: "input",
            message: "How many do you want?"
        }]
        )
        .then(function(answer) {
            // console.log("You chose item: " + answer.itemChoice + " " + JSON.stringify(productIds[answer.itemChoice], null, 2));
            console.log("You Chose: " + answer.itemChoice);
            console.log("You want to buy: " + answer.itemqty);
            let item = answer.itemChoice;
            let itemqty = answer.itemqty;
            checkInventory(item,itemqty);
        });     
    });
 
 
}

