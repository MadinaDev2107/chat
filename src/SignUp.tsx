// import React, { useState } from "react";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { auth } from "./utils/firebase.config";

// const SignUp = () => {
//   const [inp, setInp] = useState("");

//   function signUp() {
//     window.recaptchaVerifier = new RecaptchaVerifier(
//       auth,
//       "recaptcha-container",
//       {
//         size: "normal",
//         callback: (response) => {
//           // reCAPTCHA solved, allow signInWithPhoneNumber.
//           // ...
//         },
//         "expired-callback": () => {
//           // Response expired. Ask user to solve reCAPTCHA again.
//           // ...
//         },
//       }
//     );

//     signInWithPhoneNumber(auth, inp, window.recaptchaVerifier)
//       .then((confirmationResult) => {
//         // SMS sent. Prompt user to type the code from the message, then sign the
//         // user in with confirmationResult.confirm(code).
//         window.confirmationResult = confirmationResult;
//         // ...
//       })
//       .catch((error) => {
//         // Error; SMS not sent
//         // ...
//         console.log(error);
        
//       });
//   }

//   return (
//     <div>
//       <div className="card p-2 w-25">
//         <input
//           onChange={(e) => setInp(e.target.value)}
//           className="form-control mb-2"
//           type="text"
//         />
//         <button className="btn btn-dark" onClick={signUp}>
//           click
//         </button>
//       </div>

//       <div id="recaptcha-container"></div>
//     </div>
//   );
// };

// export default SignUp;
