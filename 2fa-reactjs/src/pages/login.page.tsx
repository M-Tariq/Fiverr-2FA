import { object, string, TypeOf } from "zod";
import { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import Signup from "../assets/signup.jpg";
import { LoadingButton } from "../components/LoadingButton";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useStore from "../store";
import { authApi } from "../api/authApi";
import { ILoginResponse } from "../api/types";

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const store = useStore();

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

  const loginUser = async (data: LoginInput) => {
    try {
      store.setRequestLoading(true);
      const {
        data: { user },
      } = await authApi.post<ILoginResponse>("/auth/sign-in", data);
      store.setRequestLoading(false);
      store.setAuthUser(user);
      if (user.otp_enabled) {
        navigate("/login/validateOtp");
      } else {
        navigate("/profile");
      }
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

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    loginUser(values);
  };

  return (
<section className="bg-white min-h-screen flex justify-center items-center p-8">
  <div className="w-full md:w-3/4 lg:w-1/2 bg-white rounded-lg shadow-lg flex flex-col md:flex-row">
    <div className="w-full md:w-1/2 hidden md:flex justify-center items-center">
      <img src={Signup} alt="Login Illustration" className="h-full" />
    </div>
    <div className="w-full md:w-1/2 p-8 bg-gray-100 flex flex-col justify-center items-center">
      <h2 className="text-2xl lg:text-2xl font-semibold text-green-600 mb-6">
        Login to have access
      </h2>
      
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="overflow-hidden space-y-6 w-full"
      >
        <FormProvider {...methods}>
          <FormInput label="Email" name="email" type="email" />
          <FormInput label="Password" name="password" type="password" />
          <div className="text-right">
            <Link to="/forgotpassword" className="text-gray-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-blue-800 transition-colors duration-300"
          >
            {store.requestLoading ? "Logging In..." : "Login"}
          </button>
        </FormProvider>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-green-600 hover:underline">
          Sign Up Here
        </Link>
      </p>
    </div>
  </div>
</section>

    
  );
};

export default LoginPage;
