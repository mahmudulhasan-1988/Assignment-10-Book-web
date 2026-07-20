"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useAppTheme } from "@/app/providers";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Sun,
  Moon,
  Monitor,
  Bell,
  Trash2,
  Save,
  Loader2,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  Camera,
} from "lucide-react";

const IMG_BB_KEY = "";

export default function SettingsPage() {
  const { data: session, refetch } = useSession();
  const { theme, setTheme } = useAppTheme();
  const user = session?.user;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile settings
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  // Password settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification settings (persisted to localStorage)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    deliveryUpdates: true,
    newBooks: false,
    reviews: true,
  });

  // Danger zone
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfileImage((user as any).image || "");
    }
  }, [user]);

  // Load notification preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("notificationPrefs");
      if (saved) {
        const prefs = JSON.parse(saved);
        setNotifications({
          emailNotifications: prefs.emailNotifications ?? true,
          deliveryUpdates: prefs.deliveryUpdates ?? true,
          newBooks: prefs.newBooks ?? false,
          reviews: prefs.reviews ?? true,
        });
      }
    } catch {}
  }, []);

  // Save notification preferences to localStorage
  function saveNotificationPrefs(prefs: typeof notifications) {
    localStorage.setItem("notificationPrefs", JSON.stringify(prefs));
  }

  function handleToggle(key: keyof typeof notifications) {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      saveNotificationPrefs(updated);
      return updated;
    });
    toast.success("Notification preference saved");
  }

  // Validate image before upload
  function validateImage(file: File): Promise<string | null> {
    return new Promise((resolve) => {
      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        resolve("Only JPEG, PNG, GIF, and WebP images are allowed");
        return;
      }

      // Check file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        resolve(`Image is ${sizeMB}MB. Maximum size is 5MB`);
        return;
      }

      // Check image dimensions
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        if (img.width < 100 || img.height < 100) {
          resolve("Image must be at least 100x100 pixels");
        } else if (img.width > 4000 || img.height > 4000) {
          resolve("Image must be no larger than 4000x4000 pixels");
        } else {
          resolve(null); // valid
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve("Could not read image file");
      };
      img.src = objectUrl;
    });
  }

  // Upload photo
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    const error = await validateImage(file);
    if (error) {
      toast.error(error);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setPreviewFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function confirmUpload() {
    if (!previewFile || !previewImage) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("image", previewFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.url) {
        toast.error(uploadData.error || "Failed to upload image");
        return;
      }

      const url = uploadData.url;
      setProfileImage(url);

      const patchRes = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user!.id, image: url }),
      });

      if (patchRes.ok) {
        await refetch();
        toast.success("Profile photo updated");
      } else {
        toast.error("Photo uploaded but failed to save profile");
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadingPhoto(false);
      setPreviewImage(null);
      setPreviewFile(null);
    }
  }

  function cancelPreview() {
    setPreviewImage(null);
    setPreviewFile(null);
    if (previewImage) URL.revokeObjectURL(previewImage);
  }

  async function handleSaveProfile() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSavingProfile(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user!.id, name: name.trim() }),
      });
      if (res.ok) {
        await refetch();
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to change password");
      }
    } catch {
      toast.error("Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/users?id=${user!.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Account deleted");
        window.location.href = "/";
      } else {
        toast.error("Failed to delete account");
      }
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-[var(--rr-ink)]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--rr-gold)]/10">
              <User size={20} className="text-[var(--rr-gold)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--rr-ink)]">Profile</h2>
              <p className="text-xs text-[var(--rr-ink-dim)]">Update your personal information</p>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--rr-ink-dim)]">
                    {name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                {/* Loading overlay */}
                {uploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Loader2 size={24} className="animate-spin text-white" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--rr-gold)] text-white shadow-lg hover:bg-[var(--rr-gold-bright)] transition-colors disabled:opacity-50"
              >
                {uploadingPhoto ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Camera size={12} />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--rr-ink)]">{name || "Your Name"}</p>
              <p className="text-xs text-[var(--rr-ink-dim)]">{email}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="mt-1 text-xs text-[var(--rr-gold)] hover:text-[var(--rr-gold-bright)] transition-colors"
              >
                {uploadingPhoto ? "Uploading..." : "Change Photo"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface-2)] py-2.5 pl-10 pr-4 text-sm text-[var(--rr-ink-dim)] cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-[10px] text-[var(--rr-ink-dim)]">Email cannot be changed</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="flex items-center gap-2 rounded-lg bg-[var(--rr-gold)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProfile ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--rr-slate)]/10">
              {theme === "dark" ? (
                <Moon size={20} className="text-[var(--rr-slate)]" />
              ) : theme === "light" ? (
                <Sun size={20} className="text-[var(--rr-gold)]" />
              ) : (
                <Monitor size={20} className="text-[var(--rr-slate)]" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--rr-ink)]">Appearance</h2>
              <p className="text-xs text-[var(--rr-ink-dim)]">Customize the look and feel</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light" as const, label: "Light", icon: Sun },
              { value: "dark" as const, label: "Dark", icon: Moon },
              { value: "system" as const, label: "System", icon: Monitor },
            ].map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all ${
                    isActive
                      ? "border-[var(--rr-gold)] bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]"
                      : "border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] hover:border-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)]"
                  }`}
                >
                  <Icon size={20} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Notifications Section */}
        <section className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--rr-sage)]/10">
              <Bell size={20} className="text-[var(--rr-sage)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--rr-ink)]">Notifications</h2>
              <p className="text-xs text-[var(--rr-ink-dim)]">Choose what notifications you receive</p>
            </div>
          </div>

          <div className="space-y-4">
            {([
              { key: "emailNotifications" as const, label: "Email Notifications", desc: "Receive notifications via email" },
              { key: "deliveryUpdates" as const, label: "Delivery Updates", desc: "Get notified about delivery status changes" },
              { key: "newBooks" as const, label: "New Books", desc: "Notifications when new books are added" },
              { key: "reviews" as const, label: "Review Activity", desc: "Notifications about reviews and ratings" },
            ]).map((item) => {
              const isOn = notifications[item.key];
              return (
                <div key={item.key} className="flex items-center justify-between rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--rr-ink)]">{item.label}</p>
                    <p className="text-xs text-[var(--rr-ink-dim)]">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isOn}
                    onClick={() => handleToggle(item.key)}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--rr-gold)] focus:ring-offset-2 focus:ring-offset-[var(--rr-surface)]"
                    style={{ backgroundColor: isOn ? "var(--rr-sage)" : "var(--rr-surface-2)" }}
                  >
                    <span
                      className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                      style={{ transform: isOn ? "translateX(20px)" : "translateX(0)" }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Security Section */}
        <section className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--rr-wine)]/10">
              <Shield size={20} className="text-[var(--rr-wine)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--rr-ink)]">Security</h2>
              <p className="text-xs text-[var(--rr-ink-dim)]">Manage your password and security</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Current Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] py-2.5 pl-10 pr-10 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)]"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] py-2.5 pl-10 pr-10 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)]"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Confirm New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="flex items-center gap-2 rounded-lg bg-[var(--rr-gold)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPassword ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Lock size={16} />
                )}
                Change Password
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-[var(--rr-surface)] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
              <p className="text-xs text-[var(--rr-ink-dim)]">Irreversible actions</p>
            </div>
          </div>

          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</p>
                <p className="text-xs text-[var(--rr-ink-dim)]">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 rounded-lg border border-red-300 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--rr-ink)]">Delete Account?</h3>
            <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
              This action cannot be undone. All your data, including reviews and reading lists, will be permanently deleted.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelPreview} />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[var(--rr-ink)]">Preview Photo</h3>
            <p className="mt-1 text-xs text-[var(--rr-ink-dim)]">
              {previewFile && `${(previewFile.size / 1024).toFixed(0)}KB · ${previewFile.type.split("/")[1].toUpperCase()}`}
            </p>
            <div className="mt-4 flex justify-center">
              <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-[var(--rr-surface-2)]">
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={cancelPreview}
                disabled={uploadingPhoto}
                className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                disabled={uploadingPhoto}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors disabled:opacity-50"
              >
                {uploadingPhoto ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Camera size={16} />
                )}
                {uploadingPhoto ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
