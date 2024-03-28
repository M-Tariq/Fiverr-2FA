import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import Signup from "../assets/signup.jpg";
import FormInput from "../components/FormInput";
import { LoadingButton } from "../components/LoadingButton";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import useStore from "../store";
import { GenericResponse } from "../api/types";

const registerSchema = object({
  name: string().min(1, "Full name is required").max(100),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

export type RegisterInput = TypeOf<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const store = useStore();

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const registerUser = async (data: RegisterInput) => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.post<GenericResponse>(
        "auth/sign-up",
        data
      );
      toast.success(response.data.message, {
        position: "top-right",
      });
      store.setRequestLoading(false);
      navigate("/login");
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    registerUser(values);
  };

  return (
    <section className="p-8 flex justify-center items-center h-screen">
      <div className="w-full md:w-3/4 lg:w-1/2 bg-white rounded-lg shadow-area flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 hidden md:flex justify-center items-center shadow-lg bg-gray-100">
          <img src={Signup} alt="Signup Illustration" className="h-full object-cover w-full" />
        </div>
        <div className="w-full md:w-1/2 p-8 bg-gray-100 flex flex-col justify-center items-center">
          <h2 className="text-2xl lg:text-2xl font-semibold text-green-600 mb-6">
            Sign Up To Get Started
          </h2>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="overflow-hidden space-y-6 w-full"
          >
            <FormProvider {...methods}>
              <FormInput label="Full Name" name="name" />
              <FormInput label="Email" name="email" type="email" />
              <FormInput label="Password" name="password" type="password" />
              <FormInput
                label="Confirm Password"
                name="passwordConfirm"
                type="password"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-blue-800 transition-colors duration-300"
              >
                {store.requestLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </FormProvider>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
