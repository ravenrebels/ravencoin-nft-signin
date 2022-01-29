import React from "react";

export function Avatar({ verificationObject }) {
  if (!verificationObject) {
    return null;
  }

  const assetData = verificationObject.assetdata;
  if (!assetData) {
    return null;
  }

  if (assetData.ipfs_hash) {
    return (
      <img
        src={"https://cloudflare-ipfs.com/ipfs/" + assetData.ipfs_hash}
        width="100"
        className="mt-2" />
    );
  }
}
