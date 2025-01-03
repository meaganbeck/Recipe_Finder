
//MAKE THIS SO THAT IT CAN BE CALLED BY WEBSCRAPER

BULK INSERT recipes
FROM 'C:\Users\mbeck\Recipe_project\Server\links.csv'
WITH {
    FORMAT = 'CSV',
    FIRSTROW =1,
    FIELDTERMINATOR=',',
    ROWTERMINATOR=','
    grilled cheese, corn; bread; cheese\n
    baked potato, potato; cheese; corn\n
    
};

BULK INSERT ingredients
FROM 'C:\Users\mbeck\Recipe_project\Server\links.csv'
WITH {
    FORMAT = 'CSV',
    FIRSTROW = 1,
    FIRSTCOLUMN = 2,
    
    ROWTERMINATOR = ';'
}

INSERT INTO ingredients (ingredient_id)
VALUES(---);