const fs = require("fs");
const admin = require("firebase-admin");
const config = require("./ravenConfig.json");
const axios = require("axios");

console.info("Welcome Ravencoin lover!");
healthcheck();
// Fetch the service account key JSON file contents
var serviceAccount = require("./firebaseServiceAccount.json");
var firebaseConfig = require("../client/firebaseConfig.json");
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL,
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("users");

const listener = async function (snapshot) {
  const data = snapshot.val();

  if (!data) {
    return null;
  }
  const userKeys = Object.keys(data);

  for (const userKey of userKeys) {
    const userData = data[userKey];

    const response = await rpc(config, "listaddressesbyasset", [userData.name]);

    const rvnData = response.data.result;

    //Has the user provided all informationen needed to verify identity?
    if (userData.address && userData.signature && userData.message) {
      //Check with Ravencoin if signature is correct
      /*
            Arguments:
            1. "address"         (string, required) The raven address to use for the signature.
            2. "signature"       (string, required) The signature provided by the signer in base 64 encoding (see signmessage).
            3. "message"         (string, required) The message that was signed.
*/

      const obj = await rpc(config, "verifymessage", [
        userData.address,
        userData.signature,
        userData.message,
      ]);

      //Fetch metadata about the asset, so we can get a nice IPFS image
      const metadata = await rpc(config, "getassetdata", [userData.name]);

      //Now create a "verification by user id" object with all necesarry info
      const toSave = {
        address: userData.address,
        assetdata: metadata.data.result,
        isVerified: obj.data.result,
        message: userData.message,
        name: userData.name,
        signature: userData.signature,
      };
      db.ref("verificationsbyuserid/" + userKey).update(toSave);
    }
    //OK we do NOT have all info needed to verify identity
    else if (Object.keys(rvnData).length === 1) {
      //Reset verification by user id
      db.ref("verificationsbyuserid/" + userKey).update({});

      const address = Object.keys(rvnData)[0];

      if (address !== userData.address) {
        const obj = {
          address: address,
          message: Math.random() + "",
          error: "",
        };
        db.ref("users/" + userKey).update(obj);
      }
    } else {
      //By calling "set" we delete all other attributes for this user
      db.ref("users/" + userKey).set({
        name: userData.name,
        error: userData.name + " is not a unique asset / NFT",
      });
    }
  }
  /*
          Arguments:
          1. "asset_name"               (string, required) name of asset
          2. "onlytotal"                (boolean, optional, default=false) when false result is just a list of addresses with balances -- when true the result is just a single number representing the number of addresses
          3. "count"                    (integer, optional, default=50000, MAX=50000) truncates results to include only the first _count_ assets found
          4. "start"                    (integer, optional, default=0) results skip over the first _start_ assets found (if negative it skips back from the end)
  */
};
ref.on("value", listener);

function rpc(config, method, params) {
  const options = {
    auth: {
      username: config.rpcUsername,
      password: config.rpcPassword,
    },
  };
  const data = {
    jsonrpc: "1.0",
    id: "n/a",
    method,
    params,
  };

  const rpcResponse = axios.post(config.rpcURL, data, options);
  return rpcResponse;
}

function healthcheck() {
  //HEALTHCHECK
  function checkThatFileExists(file) {
    try {
      require(file);
    } catch (_) {
      console.info("HEALTHCHECK");
      console.error(
        "Error, oops You need to create the file",
        file,
        "please read readme.md for instructions 🤍"
      );
      process.exit(1);
    }
  }
  checkThatFileExists("./ravenConfig.json");
  checkThatFileExists("./firebaseServiceAccount.json");
  checkThatFileExists("../client/firebaseConfig.json");

  //Check that we can make a successful call to Ravencoin node

  rpc(config, "listaddressesbyasset", ["DRUNK"])
    .catch((e) => {
      console.log(e.response);
      throw Error("Could not connect to Ravencoin node");
    })
    .catch((event) => {
      console.error(
        "Oops, something seems wrong, cant connect to Ravencoin node"
      );
      console.info("Your node might not be up and running with RPC enabled");
      console.log(
        "Perhaps you did not provide the correct username/password/URL"
      );
      console.info("Please check the content of ./ravenConfig.json");
      process.exit(1);
    });
}
