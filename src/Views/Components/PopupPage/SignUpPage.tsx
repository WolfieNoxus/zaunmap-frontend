import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    userName: z
      .string()
      .min(3, { message: "Name should be at least 3 characters" })
      .max(40),
    password: z
      .string()
      .min(6, { message: "Password should be at least 8 characters" })
      .max(20),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Points out that the error is related to the confirmPassword field
  });

type TFormData = z.infer<typeof schema>;

interface ILogInPageProps {
  onChangePage: (page: "logIn" | "forgotPassword") => void;
}

const SignUpPage = ({onChangePage}: ILogInPageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TFormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: TFormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          E-mail
        </label>
        <input
          {...register("email")}
          id="email"
          type="text"
          className="form-control"
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="userName" className="form-label">
          User Name
        </label>
        <input
          {...register("userName")}
          id="userName"
          type="text"
          className="form-control"
        />
        {errors.userName && (
          <p className="text-danger">{errors.userName.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          className="form-control"
        />
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          className="form-control"
        />
        {errors.confirmPassword && (
          <p className="text-danger">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        disabled={!isValid}
        className={isValid ? "btn btn-primary" : "btn btn-secondary"}
        // className="btn btn-primary"
        type="submit"
      >
        Sign Up
      </button>

      <div>
        <span onClick={() => onChangePage("logIn")}>Log in</span>
        <span onClick={() => onChangePage("forgotPassword")}>
          Forgot Password
        </span>
      </div>
    </form>
  );
};

export default SignUpPage;
