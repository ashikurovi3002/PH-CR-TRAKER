"use client";

import React, { useEffect, useState } from "react";
import { User as UserIcon, Loader2, Camera, Save, Shield, MapPin, GraduationCap, Building2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function AmbassadorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    campus: "",
    department: "",
    clubName: "",
    institutionType: "UNIVERSITY",
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      const userData = res.data.data;
      setUser(userData);
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        campus: userData.campus || "",
        department: userData.department || "",
        clubName: userData.clubName || "",
        institutionType: userData.institutionType || "UNIVERSITY",
      });
      if (userData.profileImage) {
        setPreviewImage(userData.profileImage.startsWith('http') ? userData.profileImage : `http://localhost:5001${userData.profileImage}`);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let profileImageUrl = user.profileImage;

      // Upload new image if selected
      if (profileImageFile) {
        const uploadData = new FormData();
        uploadData.append("file", profileImageFile);
        const uploadRes = await api.post('/upload/single', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        profileImageUrl = uploadRes.data.data.url;
      }

      // Update profile
      await api.patch('/ambassador/profile', {
        ...formData,
        profileImage: profileImageUrl
      });

      toast.success("Profile updated successfully!");
      // reload the page to update sidebar context
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 opacity-10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 opacity-10 rounded-full blur-3xl translate-y-1/4 pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Profile Settings</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your personal information and ambassador details.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10"
      >
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="w-36 h-36 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-indigo-500 to-indigo-400 shadow-xl transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center relative">
                    {previewImage ? (
                      <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-16 h-16 text-gray-300" />
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {/* Floating badge */}
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-gray-800">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">Ambassador</p>
            </div>

            <div className="flex-1 w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-indigo-500" /> Full Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" /> Email Address
                  </label>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 h-12 rounded-xl opacity-70 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500" /> Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus-visible:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 uppercase font-semibold tracking-wider">Academic Details</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" /> Campus / University
              </label>
              <Input
                type="text"
                name="campus"
                value={formData.campus}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus-visible:ring-indigo-500 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" /> Department
              </label>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus-visible:ring-indigo-500 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-500" /> Institution Type
              </label>
              <select
                name="institutionType"
                value={formData.institutionType}
                onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus-visible:ring-indigo-500 shadow-sm px-3"
              >
                <option value="UNIVERSITY">University</option>
                <option value="POLYTECHNIC">Polytechnic</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-500" /> Club / Organization Name
              </label>
              <Input
                type="text"
                name="clubName"
                value={formData.clubName}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus-visible:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8 text-base font-semibold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
              disabled={saving}
            >
              {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
