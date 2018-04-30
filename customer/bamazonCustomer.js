var inquire = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');

var rows = [];

var connection = mysql.createConnection({
    host:"localhost",
    port:8889,
    user: "root",
    password: "root",
    database: "bamazon_DB"
})

function printTable(callback){
    connection.query("SELECT*FROM products",function(err, res){
        if (err) throw err
        for (var i=0; i<res.length; i++){
            var row = res[i];
            var id = row.item_id
            var name = row.product_name
            var price = row.price
            var department = row.depatment_name
            var stock = row.stock_quantity
            var values = [id, name, price, department, stock]
            rows.push(values)
        }
        console.table(["Id", "Name", "Price", "Department", "Stock",], rows)
        callback();
    
    })
}

function start(){
    inquire.prompt([{
        name:"product",
        type:"input",
        message: "Please type the id of the product you want to purchase",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    },{
        name:"quantity",
        type:"input",
        message:"What quantity would you like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    }]).then(function(answers){
        var id=0
        id=parseInt(answers.product);
        connection.query("SELECT stock_quantity FROM products WHERE item_id=?", id, function(err, res){
            if (err) throw err
            var stock=0
            stock = parseInt(res[0].stock_quantity) - parseInt(answers.quantity);
            if (stock<0){
                console.log("Insufficient stock, try again!")
                rows=[];
                printTable(start);
            }
            else{            
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id=?",[stock, id])
            rows=[];
            printTable(start);
            }


        })        
        
        
    })
}

printTable(start);