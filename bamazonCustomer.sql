CREATE DATABASE bamazon

CREATE TABLE products (
	id INTEGER AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(40) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	price DECIMAL (7, 2) NOT NULL,
	stock_quantity INTEGER NOT NULL,
	PRIMARY KEY (id)
	);

	INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES
		("hat", "clothing", 15.00, 734),
		("iphoneX", "technology", 1500.00, 10000),
		("android phone", "maybe tech", 0.01, 0),
		("addidas", "footwear", 150.00, 200),
		("raybans", "accesories", 195.00, 1345),
		("xmas lights", "house and home", 12.00, 3000),
		("socks", "clothing", 20.00, 843),
		("shovels", "gardening", 37.42, 58),
		("dog_food", "pets", 22.00, 254),
		("dog_bone", "pets", 2.50, 321);
