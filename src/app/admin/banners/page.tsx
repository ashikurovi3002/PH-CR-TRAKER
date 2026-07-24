"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, X, Upload, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Banner {
  id: number;
  title: string;
  image: string;
  order: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({ title: "", order: 0, image: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get("/banners");
      setBanners(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingId(banner.id);
      setFormData({
        title: banner.title,
        order: banner.order,
        image: banner.image,
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", order: 0, image: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataToUpload = new FormData();
    formDataToUpload.append("file", file);

    setUploadingImage(true);
    try {
      const res = await api.post("/upload/single", formDataToUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, image: res.data.data.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      toast.error("Title and Image are required");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/banners/${editingId}`, formData);
        toast.success("Banner updated successfully");
      } else {
        await api.post("/banners", formData);
        toast.success("Banner created successfully");
      }
      handleCloseModal();
      fetchBanners();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    
    try {
      await api.delete(`/banners/${id}`);
      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete banner");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Banners</h1>
          <p className="text-gray-500">Add, edit, and organize promotional banners.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {banners.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No banners found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  banners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {banner.order}
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-16 w-32 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600">
                          {banner.image ? (
                            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {banner.title}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleOpenModal(banner)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(banner.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-xl font-bold">{editingId ? "Edit Banner" : "Create New Banner"}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Banner Image</label>
                <div className="relative group rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-900/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="h-32 flex flex-col items-center justify-center">
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover absolute inset-0 z-0" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <span className="text-white text-sm font-medium flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Change Image
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 font-medium">Click to upload banner</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    onChange={handleImageUpload} 
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-30">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g., Welcome to the new term!"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Order</label>
                  <Input
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                  <p className="text-xs text-gray-500">Lower numbers appear first.</p>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" disabled={saving || uploadingImage}>
                  {saving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> {editingId ? "Update" : "Save"} Banner</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
