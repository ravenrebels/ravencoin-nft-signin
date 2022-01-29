import React from "react";

interface IProps {
  address: string;
  next: () => void;
  setName: any;
  name: string;
}
export function Step1({ address, name, next, setName }: IProps) {
  if (address) {
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
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Enter name of your NFT
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          onChange={(event) => {
            setName(event.target.value);
          }}
          value={name}
        />
      </div>

      <div className="mb-3 row mt-4">
        <button
          type="button"
          className="btn btn-primary form-control"
          onClick={next}
        >
          Next
        </button>
      </div>
    </div>
  );
}
