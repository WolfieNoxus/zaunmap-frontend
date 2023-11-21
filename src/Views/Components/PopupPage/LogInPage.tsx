// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import useAuth0 hook

interface ILogInPageProps {
  onChangePage: (page: "signUp" | "forgotPassword") => void;
}

const LogInPage = ({ onChangePage }: ILogInPageProps) => {
  const { loginWithRedirect } = useAuth0(); // Access the loginWithRedirect function from Auth0

  const handleLogin = () => {
    // Call Auth0 login function to trigger the authentication flow
    loginWithRedirect();
  };

  return (
    <div>
      <h2>Login</h2>
      <button className="btn btn-primary" onClick={handleLogin}>
        Log In with Auth0
      </button>
      <div>
        <span onClick={() => onChangePage("signUp")}>Sign Up</span>
        <span> | </span>
        <span onClick={() => onChangePage("forgotPassword")}>
          Forgot Password
        </span>
      </div>
    </div>
  );
};

// const schema = z.object({
//   userName: z
//     .string()
//     .min(3, { message: "Name should be at least 3 characters" })
//     .max(40),
//   password: z
//     .string()
//     .min(6, { message: "Password should be at least 8 characters" })
//     .max(20),
// });

// type TFormData = z.infer<typeof schema>;

// interface ILogInPageProps {
//   onChangePage: (page: "signUp" | "forgotPassword") => void;
// }

// const LogInPage = ({ onChangePage }: ILogInPageProps) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//   } = useForm<TFormData>({ resolver: zodResolver(schema) });

//   const onSubmit = (data: TFormData) => {
//     console.log(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div className="mb-3">
//         <label htmlFor="userName" className="form-label">
//           User Name
//         </label>
//         <input
//           {...register("userName")}
//           id="userName"
//           type="text"
//           className="form-control"
//         />
//         {errors.userName && (
//           <p className="text-danger">{errors.userName.message}</p>
//         )}
//       </div>

//       <div className="mb-3">
//         <label htmlFor="password" className="form-label">
//           Password
//         </label>
//         <input
//           {...register("password")}
//           id="password"
//           type="password"
//           className="form-control"
//         />
//         {errors.password && (
//           <p className="text-danger">{errors.password.message}</p>
//         )}
//       </div>

//       <button
//         disabled={!isValid}
//         className={isValid ? "btn btn-primary" : "btn btn-secondary"}
//         // className="btn btn-primary"
//         type="submit"
//       >
//         Log In
//       </button>
//       <div>
//         <span onClick={() => onChangePage("signUp")}>Sign Up</span>
//         <span> | </span>
//         <span onClick={() => onChangePage("forgotPassword")}>
//           Forgot Password
//         </span>
//       </div>
//     </form>
//   );
// };

export default LogInPage;
