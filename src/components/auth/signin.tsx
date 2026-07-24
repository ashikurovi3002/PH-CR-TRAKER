"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Signed in successfully!");
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("userRole", result.data.user.role);
        
        if (result.data.user.role === 'admin') {
          router.push("/admin/dashboard");
        } else {
          router.push("/ambassador/dashboard");
        }
      } else {
        toast.error(result.message || "Failed to sign in");
      }
    } catch (error) {
      toast.error("An error occurred during sign in");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      <div className="space-y-1.5 text-left">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          className="bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5 text-left">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className="bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl h-12 mt-6" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Signing in...
          </span>
        ) : "Sign In"}
      </Button>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        Don't have an account?{" "}
        <button type="button" onClick={() => router.push('/register')} className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
          Sign up here
        </button>
      </div>
    </form>
  );
}
