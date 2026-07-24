"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Upload, X, Image as ImageIcon, ArrowRight, ArrowLeft } from "lucide-react";

const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  institutionType: yup.string().required("Institution type is required"),
  campus: yup.string().required("Institute/Campus Name is required"),
  department: yup.string().required("Department is required"),
  clubName: yup.string().required("Club Name is required"),
});

type FormDataSchema = yup.InferType<typeof schema>;

export function SignUpForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormDataSchema>({
    resolver: yupResolver(schema),
    mode: "onTouched"
  });

  const handleNextStep = async () => {
    // Validate fields for Step 1
    const isStep1Valid = await trigger(["name", "email", "phone", "password", "confirmPassword"]);
    if (isStep1Valid) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormDataSchema) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const { confirmPassword, ...registerData } = data;
      
      // Append text fields
      Object.entries(registerData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      
      // Append image if exists
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        router.push("/login");
      } else {
        toast.error(result.message || "Failed to create account");
      }
    } catch (error) {
      toast.error("An error occurred during sign up");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2 mb-8">
        <div className={`h-2 rounded-full flex-1 transition-all duration-300 ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
        <div className={`h-2 rounded-full flex-1 transition-all duration-300 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Details</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set up your personal ambassador profile.</p>
          </div>

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center justify-center space-y-3 mb-6">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
            />
            
            <div className="relative group">
              {imagePreview ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 dark:border-indigo-900 shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div 
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-indigo-400 transition-all shadow-sm"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-[10px] font-medium text-gray-500">Upload Photo</span>
                </div>
              )}
              
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 w-7 h-7 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 text-gray-500 hover:text-red-500 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  className="bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500"
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>

          <Button type="button" onClick={handleNextStep} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl h-12 mt-6">
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Campus Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tell us where you are representing.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="institutionType" className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution Type</Label>
              <select
                id="institutionType"
                {...register("institutionType")}
                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="">Select Type...</option>
                <option value="POLYTECHNIC">Polytechnic</option>
                <option value="UNIVERSITY">University</option>
              </select>
              {errors.institutionType && <p className="text-xs text-red-500 mt-1">{errors.institutionType.message}</p>}
            </div>

            <div className="space-y-1.5 text-left">
              <Label htmlFor="campus" className="text-sm font-medium text-gray-700 dark:text-gray-300">Institute / Campus Name</Label>
              <Input
                id="campus"
                type="text"
                placeholder="e.g. Dhaka University"
                className="bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500"
                {...register("campus")}
                aria-invalid={!!errors.campus}
              />
              {errors.campus && <p className="text-xs text-red-500 mt-1">{errors.campus.message}</p>}
            </div>

            <div className="space-y-1.5 text-left">
              <Label htmlFor="department" className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</Label>
              <Input
                id="department"
                type="text"
                placeholder="e.g. Computer Science"
                className="bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500"
                {...register("department")}
                aria-invalid={!!errors.department}
              />
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
            </div>

            <div className="space-y-1.5 text-left">
              <Label htmlFor="clubName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Club Name</Label>
              <Input
                id="clubName"
                type="text"
                placeholder="e.g. Programming Club"
                className="bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500"
                {...register("clubName")}
                aria-invalid={!!errors.clubName}
              />
              {errors.clubName && <p className="text-xs text-red-500 mt-1">{errors.clubName.message}</p>}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button type="button" variant="outline" onClick={handlePrevStep} className="w-1/3 h-12 rounded-xl">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl h-12" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating account...
                </span>
              ) : "Complete Registration"}
            </Button>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        Already have an account?{" "}
        <button type="button" onClick={() => router.push('/login')} className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
          Sign in here
        </button>
      </div>
    </form>
  );
}
