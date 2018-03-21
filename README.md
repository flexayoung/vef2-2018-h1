# Hópverkefni 1

Útfæra skal vefþjónustu fyrir „bókasafn“ með notendaumsjón. Gefin eru gögn fyrir bækur og flokka.

## Installation

First you need to set up a postgres database. Make sure to update `PORT`, `HOST` and `DATABASE_URL`  in the `.env` to match that of your database. 

Navigate to `/cloudinary` and run  `node createdb.js`. This will set up the tables as well as fill them with lots of exciting book entries.

Now your all set and ready to go. Run `npm start` to launch the application.

## API

Some examples of calls to the database:

`curl -d '{"username":"myUsername", "password":"itsAsecret", "name":"My Name"}' -H "Content-Type: application/json" -X POST http://localhost:3000/register`
  ```json
{ 
    "id": 19,
    "username": "myUsername",
    "name":"My Name",
    "image":null
  }
```
  
  `curl http://localhost:3000/books/66`
    ```json
{
    "id":6,
    "title":"A Crown of Swords (Wheel of Time, #7)",
    "isbn13":"9780812550283","author":"Robert Jordan",
    "descr":"Elayne, Aviendha, and Mat work to restore the world's natural weather, while Egwene gathers a group of female channelers and Rand confronts the dread Forsaken Sammael, in the seventh volume in the Wheel of Time series. Reprint.",
    "category":"Fantasy"
    }
```
  

## The A-Team

* Alexandra Mjöll Young (amy1@hi.is) (https://github.com/flexayoung)
* Nu Phan Quynh Do (npq1@hi.is) (https://github.com/mimiqkz)

