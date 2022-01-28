## Educational project, showing how you can sign in to a web site with Ravencoin NFT
![image](https://user-images.githubusercontent.com/9694984/151614866-7bc0546c-a551-42ba-a95e-4fb6e19be08a.png)


### Setup a firebase project

Choose "Realtime database"

Set the rules for Realtime database
![image](https://user-images.githubusercontent.com/9694984/151613825-1033b54d-5e81-471c-9176-8de7ac68fa89.png)

```
{
  "rules": {
    "verificationsbyuserid": {
      "$uid": {         
        ".read": "$uid === auth.uid"
      }
    },
    "users": {
      "$uid": {
        ".write": "$uid === auth.uid",
        ".read": "$uid === auth.uid"
      }
    }
  }
}
```
Export service account file (JSON) and save it as 
``` ./backend/firebaseServiceAccount.json ``` 
![Inkedconsole firebase google com_u_0_project_signin-80421_settings_general_web_MzEwNWM4YmItNTE4Yy00ODY5LTk0ZWItMjQ0MTg3YzQyMDVk_LI](https://user-images.githubusercontent.com/9694984/151614593-8c98b85e-1ad5-4f68-afe7-a552db3349e0.jpg)

#### ./backend/ravenConfig.json
Update the content.
That is enter your username/password and url/port for your Ravencoin core QT
Syntax
```
{
  "rpcUsername": "VerySecret",
  "rpcPassword": "VerySecret",
  "rpcURL": "http://127.0.0.1:8766"
}

```

### build client


change directory to ./client
run 

```npm install```

To start local dev server run

```npm start```


### build server
run
```npm install```
