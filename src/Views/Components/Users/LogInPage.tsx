import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Name should be at least 3 characters" })
    .max(40),
  password: z
    .string()
    .min(6, { message: "Password should be at least 8 characters" })
    .max(20),
});

type TFormData = z.infer<typeof schema>;

const LogInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: TFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="userName" className="form-label">
          User Name
        </label>
        <input
          {...register("username")}
          id="userName"
          type="text"
          className="form-control"
        />
        {errors.username && (
          <p className="text-danger">{errors.username.message}</p>
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

      <button
        disabled={!isValid}
        className={isValid ? "btn btn-primary" : "btn btn-secondary"}
        // className="btn btn-primary"
        type="submit"
      >
        Log In
      </button>
    </form>
  );
};

export default LogInPage;
