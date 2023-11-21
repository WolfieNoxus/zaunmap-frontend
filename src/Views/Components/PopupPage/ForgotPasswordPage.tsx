import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  userName: z
    .string()
    .min(3, { message: "Name should be at least 3 characters" })
    .max(40),
});

type TFormData = z.infer<typeof schema>;

interface ILogInPageProps {
  onChangePage: (page: "logIn" | "signUp" | "home") => void;
}

const ForgotPasswordPage = ({ onChangePage }: ILogInPageProps) => {
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

      <button
        disabled={!isValid}
        className={isValid ? "btn btn-primary" : "btn btn-secondary"}
        // className="btn btn-primary"
        type="submit"
      >
        Find Password
      </button>

      <div>
        <span onClick={() => onChangePage("logIn")}>Log in</span>
        <span> | </span>
        <span onClick={() => onChangePage("signUp")}>Sign Up</span>
        <span> | </span>
        <span onClick={() => onChangePage("home")}>Home</span>
      </div>
    </form>
  );
};

export default ForgotPasswordPage;
