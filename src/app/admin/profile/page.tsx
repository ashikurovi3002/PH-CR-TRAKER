"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Save, User, Phone, Lock, Upload, Image as ImageIcon, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    profileImage: "",
    role: "",
    institutionType: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      if (res.data.data) {
        const user = res.data.data;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          password: "",
          profileImage: user.profileImage || "",
          role: user.role || "",
          institutionType: user.institutionType || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataToUpload = new FormData();
    formDataToUpload.append("file", file);

    setUploadingImage(true);
    try {
      const res = await api.post("/upload", formDataToUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData((prev) => ({ ...prev, profileImage: res.data.data.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updateData: any = {
        name: formData.name,
        phone: formData.phone,
        profileImage: formData.profileImage,
        institutionType: formData.institutionType,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      await api.patch('/admin/profile', updateData);
      toast.success("Profile updated successfully");
      // clear password field after successful update
      setFormData(prev => ({ ...prev, password: "" }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Profile</h1>
        <p className="text-gray-500">Manage your administrative account settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Profile Picture Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100 dark:border-gray-700">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-50 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-indigo-300" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{formData.name || 'Admin Name'}</h3>
              <p className="text-sm text-gray-500">{formData.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 uppercase">
                  {formData.role}
                </span>
                {formData.institutionType && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 uppercase">
                    {formData.institutionType}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Full Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Admin Name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                Email Address <span className="text-xs text-gray-400 font-normal">(Read-only)</span>
              </label>
              <Input
                name="email"
                value={formData.email}
                disabled
                className="bg-gray-50 dark:bg-gray-900/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Phone Number
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-400" />
                Institution Type
              </label>
              <select
                name="institutionType"
                value={formData.institutionType}
                onChange={handleChange as any}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white dark:bg-gray-800"
              >
                <option value="">Select Type</option>
                <option value="UNIVERSITY">University</option>
                <option value="POLYTECHNIC">Polytechnic</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                New Password
              </label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <Button type="submit" disabled={saving || uploadingImage} className="w-full sm:w-auto">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
