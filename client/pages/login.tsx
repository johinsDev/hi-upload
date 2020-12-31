import { FormikHelpers, useFormik } from "formik";
import * as React from "react";
import { useMutation, useQueryClient } from "react-query";
import { defaultMutationFn } from "../shared/api";
import * as Yup from "yup";
import cs from "classnames";
import { useRouter } from "next/dist/client/router";

// axios
// credentials with cookie, rate limitjing, cache typeorm
// protec routes

interface Values {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().required().email().min(6).max(255),
  password: Yup.string().required().min(6).max(255),
});

const LoginPage = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutate } = useMutation(defaultMutationFn, {
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);

      queryClient.setQueryData("auth/me", data);
    },
  });

  async function onSubmit(values: Values, actions: FormikHelpers<Values>) {
    try {
      await mutate([
        "/auth/sign-in",
        {
          email: values.email,
          password: values.password,
        },
        "POST",
      ]);

      router.push("/");
    } catch (error) {
      console.log("Error from backend parded");
    } finally {
      actions.setSubmitting(false);
    }
  }

  const { handleBlur, handleChange, handleSubmit, errors } = useFormik<Values>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
  });

  return (
    <section className="w-10/12 md:w-6/12 mx-auto">
      <form action="#" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="inline-block text-sm mb-2">
            Email address
          </label>
          <input
            type="email"
            name="email"
            className={cs(
              "w-full border-2 border-gray-200 h-10 px-3 rounded-md focus:outline-none",
              { "border-red-500": !!errors.email }
            )}
            onChange={handleChange("email")}
            onBlur={handleBlur("email")}
          />
          {!!errors.email && (
            <label className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
              {errors.email}
            </label>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="inline-block text-sm mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange("password")}
            onBlur={handleBlur("password")}
            className={cs(
              "w-full border-2 border-gray-200 h-10 px-3 rounded-md focus:outline-none",
              { "border-red-500": !!errors.password }
            )}
          />
          {!!errors.password && (
            <label className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1 ">
              {errors.password}
            </label>
          )}
        </div>

        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-3 leading-none rounded-lg font-medium mb-3"
        >
          Login
        </button>

        <p className="text-sm text-gray-800">
          Not joined yet?{" "}
          <a href="" className="text-indigo-500">
            Create account
          </a>
        </p>
      </form>
    </section>
  );
};

export default LoginPage;
