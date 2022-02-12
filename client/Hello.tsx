import React from "react";
import { Avatar } from "./Avatar";

export function Hello({ verificationObject, signOut }) {
  console.log("VerificationObject", verificationObject);
  if (!verificationObject) {
    return null;
  }
  const isVerified = verificationObject.isVerified;
  if (!isVerified) {
    return null;
  }

  return (
    <div>
      <div>
        Hello <strong> {verificationObject && verificationObject.name}</strong>
        <div>
          <Avatar verificationObject={verificationObject} />
        </div>
      </div>
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/9yqZAccfhBM"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <div
        style={{
          display: "flex",
          flex: "1",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={signOut}
          style={{ float: "right" }}
          className="mt-5 btn btn-primary"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
