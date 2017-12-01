var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table-redemption");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

connection.connect(function(err) {
  if (err) throw err;
    startBuying();
    printTable();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function printTable() {
  connection.query("SELECT * FROM products", function(error, results, fields) {
    var table = new Table({
      head: ["ID", "Item", "Department", "Price", "Quantity"],
      colWidths: [5, 30, 30, 20, 20],
    });

    for (var i = 0; i < results.length; i++) {
      table.push(
        [results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
      );
    }
    console.log(table.toString());
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function startBuying() {
  inquirer
    .prompt ([
      {
        name: "idinput",
        type: "input",
        message: "Please input item ID number of the product you would like to buy?",
        filter: function (input){
          return parseFloat(input);
        },
        validate: function (input){
          if (isNaN(input)){
            return 'Please type a number!';
          }

          return true;
        }
      },
      {
        name: "amount",
        type: "input",
        message: "How many would you like to buy?",
        filter: function (input){
          return parseFloat(input);
        },
        validate: function (input){
          if (isNaN(input)){
            return 'Please type a number!';
          }

          return true;
        }
      }
      ]).then(function(answer) {

        connection.query(
          "SELECT stock_quantity FROM products WHERE id = ?",
          [answer.idinput],
          function(error, results, fields) {

            if (answer.amount > results[0].stock_quantity) {
            console.log("Sorry, we don't have any left.");
            startBuying();
            }

            else if (answer.amount <= results[0].stock_quantity) {

                connection.query("UPDATE products SET ? WHERE ?", [
              {
                stock_quantity: results[0].stock_quantity - answer.amount
              },
              {
                id: answer.idinput
              }],
              function (err, res, f){
                connection.query("SELECT * FROM products WHERE id =?", [answer.idinput], function(err, res, f){
                  var cost = answer.amount * res[0].price;
                    console.log("Here are your items. That will be $" + cost + ".");

                  var timeOut = setTimeout(function() {
                      printTable();
                      clearTimeout(timeOut);
                    }, 5000);

                  startBuying();
              });
            }
          );
        }
      }
    );
  });
}
