const admin = require("firebase-admin");
const config = require("./ravenConfig.json");
const axios = require("axios");
// Fetch the service account key JSON file contents
var serviceAccount = require("./firebaseServiceAccount.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://signin-80421-default-rtdb.europe-west1.firebasedatabase.app",
});

function getAddressByNFT(name) {
  //Talk to Ravencoin
}

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
      console.log("VERIFY MESSAGE", obj.data.result);
      const metadata = await rpc(config, "getassetdata", [userData.name]);

      const toSave = {
        address: userData.address,
        signature: userData.signature,
        message: userData.message,
        isVerified: obj.data.result,
        name: userData.name,
        assetdata: metadata.data.result,
      };
      db.ref("verificationsbyuserid/" + userKey).update(toSave);
    }
    if (Object.keys(rvnData).length === 1) {
      const address = Object.keys(rvnData)[0];

      if (address !== userData.address) {
        const obj = {
          address: address,
          message: Math.random() + "",
        };
        db.ref("users/" + userKey).update(obj);
      }
    } else {
      console.log("Did not get one for", userData.name);
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
