import React from "react";

interface IProps {
  address: any;
  isVerified: boolean;
  message: any;
  signature: any;
  setSignature: any;
  signIn: () => void;
  signOut: () => void;
}
export function Step2({
  address,
  isVerified,
  message,
  signature,
  setSignature,
  signIn,
  signOut,
}: IProps) {
  if (isVerified) {
    return null;
  }
  if (!address) {
    return null;
  }

  return (
    <div
      style={{
        border: "1px solid silver",
        borderRadius: "20px",
        padding: "30px",
      }}
    >
      <p className="mt-4">Please sign the message with the address</p>

      <p>
        <strong>Address</strong> <small>{address}</small>
      </p>
      <p>
        <strong>Message</strong> {message}
      </p>

      <p>
        <div class="mb-3">
          <label htmlFor="signature" class="form-label">
            Signature
          </label>

          <textarea
            id="signature"
            name="signature"
            className="form-control"
            value={signature}
            onChange={(event) => {
              setSignature(event.target.value);
            }}
          ></textarea>
        </div>
      </p>

      <button className="btn btn-primary" onClick={signIn}>
        Sign in
      </button>
      <button
        style={{ float: "right" }}
        className="btn btn-secondary"
        onClick={signOut}
      >
        Cancel
      </button>
    </div>
  );
}
