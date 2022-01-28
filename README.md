## Educational project, showing how you can sign in to a web site with Ravencoin NFT


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

#### ./backend/ravenConfig.json
Update the content.
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
