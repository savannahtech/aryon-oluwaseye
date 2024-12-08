import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import useStore from "@/store";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const signupSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/,
      "Password can only contain alphanumeric characters and special characters",
    ),
});

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: () => {
    const user = localStorage.getItem("user");

    if (user) {
      const { token } = JSON.parse(user) as User;

      if (token) {
        throw redirect({
          to: "/dashboard",
          replace: true,
        });
      }
    }
  },
});

function Login() {
  const { login } = useStore();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitForm = form.handleSubmit(async (data) => {
    await login(data);
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Login to your account
          </h2>
        </div>

        <Form {...form}>
          <form className="mt-8 space-y-6" onSubmit={submitForm}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:!ring-teal-500 focus:ring-offset-2"
              disabled={form.formState.isSubmitting}
            >
              Sign in
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Login;
