import React, { useState } from "react";
import "./Successmessage.scss";

function Successmessage({ success, added, successPrimary }) {
  return (
    <div>
      <div
        className={
          added ? "successSubCont successSubContShow" : "successSubCont"
        }
      >
        <div class="success-animation">
          <svg
            class="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              class="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              class="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <div className="successTxt">
          <h2>{successPrimary}</h2>
          <h4>{success}</h4>
        </div>
      </div>
    </div>
  );
}

export default Successmessage;
