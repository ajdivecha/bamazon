var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table-redemption");

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

connection.connect(function(err) {
  if (err) throw err;
    managerView();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

    var timeout = setTimeout(function() {
      managerView();
    }, 4000);
  });
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function managerView() {
  inquirer
    .prompt ([
      {
        name: "manager",
        type: "list",
        message: "what would you like to do boss?",
        choices: [
          "View products for sale",
          "View low inventory",
          "Add to inventory",
          "Add new product"
        ]
      }
    ])
    .then(function(answer){
      switch(answer.manager) {
        case "View products for sale":
          viewProduct();
          break;

        case "View low inventory":
          viewLowInventory();
          break;

        case "Add to inventory":
          addInventory();
          break;

        case "Add new product":
          newProduct();
          break;
      }
    });
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function viewProduct() {
    printTable();
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 10", function(error, results, fields) {
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

      var timeout = setTimeout(function() {
        managerView();
      }, 4000);
    });
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function addInventory() {
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
    inquirer
      .prompt ([
        {
          name: "idinput",
          type: "input",
          message: "Please input item ID number of the product you would like to order?",
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
          message: "How many of those would you like to order?",
            filter: function (input){
              return parseFloat(input);
            },
            validate: function (input){
              if (isNaN(input)){
                return "Needs to be a number boss.";
              }

                return true;
            }
        },
      ])
      .then(function(input) {

        connection.query("SELECT stock_quantity FROM products WHERE id =?", [input.idinput], function(error, results, fields){

          if (error) {
            console.log("error");
          }

          connection.query("UPDATE products SET ? WHERE ?", [{
            stock_quantity: input.amount + results[0].stock_quantity
          },
          {
            id: input.idinput
          }
        ],
          function (e, r, f){
            if(!e) {
              printTable();
              console.log("Updated!");
            }
          }
        );
      }
    );
  });
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function newProduct() {
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What is the new product?"
        },
        {
          name: "department",
          type: "input",
          message: "What department does this product belong in?"
        },
        {
          name: "price",
          type: "input",
          message: "What price will be be charging?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "amount",
          type: "input",
          message: "How many would you like to add to the inventory?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer){
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.item,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.amount
          },
          function(err) {
            if(err) throw err;
            console.log("New product has been ordered!");
            printTable();
          }
        );
      });
  }
