So yea, this is a thing

# How to host yourself
To host, run the following commands in console

```
npm i
npm start
```

Now its hosted on https://localhost:3000

You have set up the frontend part just using those commands, hooray! But you still need to set up the backend

#### Step 1
Download an apache + mysql server host. I preferrably use [xampp](https://www.apachefriends.org/) which has a configurable apache and mysql server dashboard which is easy to set up
#### Step 2
***All following steps are based on xampp***

Launch both the apache server and the mysql server 
![image](https://github.com/29cmb/Portfolious/assets/71194682/fd2542fe-4eed-40b4-b1b8-bba33f856444)
Once it looks like the image above, go to `http://localhost/phpmyadmin/`and upload the `database.sql` file from the main directory

#### Step 3

Press the `User Accounts` button in the topbar and locate `root localhost` and press `Edit privileges`
![image](https://github.com/29cmb/Portfolious/assets/71194682/a89c0717-d92c-43c9-82a7-85bac4452533)

#### Step 4
Click "change password" and designate the root account a password
![image](https://github.com/29cmb/Portfolious/assets/71194682/6cd83295-18e2-4104-a960-023af512ceb8)
After you've changed the password, go back to xampp and click Apache > Config > phpMyAdmin (config.inc.php) and change this line
```php
$cfg['Servers'][$i]['password'] = 'yourNewPassword';
```

#### Step 5
In the project files, create a .env file and fill out the information
```
PORT=3000 # do not change
DIR="views" # do not change

dbHost="localhost" # do not change
dbName="portfolious" # do not change
dbUsername="root" # do not change
dbPassword="passwordToTheDatabase"
secret="secretToUseForPasswordHashing"
cookieSecret="secretToUseForSessionCookieHashing"


apininjas="apiNinjasAPIKey"
```
**[API NINJAS](https://api-ninjas.com/) - YOU MUST HAVE A VALID API KEY**


Congrats, you've successfully set up the backend and you now have a fully set up server.


### Suggest changes in the issues and pull requests tab

Honestly idk how they work, so go figure it out for me
