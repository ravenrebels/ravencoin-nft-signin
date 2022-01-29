import React from "react";

export function Intro({ isVerified }) {
  if (isVerified) {
    return null;
  }
  return (
    <div>
      <h1 className="h3">Sign in</h1>
      <p>
        {" "}
        <i>with Ravencoin NFT (unique asset)</i>
      </p>
    </div>
  );
}
