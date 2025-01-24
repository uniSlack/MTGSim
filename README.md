Created in VSCode.

Make sure you have node.js installed: https://nodejs.org/en/download. 

Download "Oracle Cards" database from scryfall and put it in the same directory as your Server and Client folders: https://scryfall.com/docs/api/bulk-data

First time running, copy paste the code from databaseImport.js to the top of index.js and change the DataBaseName variable to the name of your database. Remove the code afterward.

First Terminal in home:

    npm start

Second Terminal:

    cd client

    npm start

Backend:    http://localhost:3001/api

frontend:   http://localhost:3000 (multiple tabs to test networking)


If security issues bc reinstall, put in each terminal (WARNING, might be security issue, exercise caution):

    Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process
