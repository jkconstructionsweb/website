"use client";
import React, { useState } from "react";
import { Shield, KeyRound, CheckCircle } from "lucide-react";

export default function AccountSettingsPage() {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const actualPass = localStorage.getItem("jk_admin_password") || "jk@2024";

    if (currentPass !== actualPass) {
      setError("Current password is incorrect.");
      return;
    }

    if (newPass.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPass !== confirmPass) {
      setError("New passwords do not match.");
      return;
    }

    localStorage.setItem("jk_admin_password", newPass);
    setSuccess(true);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral/30">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral/20">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary">Security Settings</h2>
            <p className="text-sm text-secondary/60">Update your admin login password</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
            <CheckCircle size={18} /> Password updated successfully! Next time you login, use your new password.
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">Current Password</label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
              <input type="password" required value={currentPass} onChange={e => setCurrentPass(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral/40 focus:border-primary outline-none text-sm font-semibold transition-colors"
                placeholder="Enter current password" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">New Password</label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
              <input type="password" required value={newPass} onChange={e => setNewPass(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral/40 focus:border-primary outline-none text-sm font-semibold transition-colors"
                placeholder="Enter new password" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">Confirm New Password</label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
              <input type="password" required value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral/40 focus:border-primary outline-none text-sm font-semibold transition-colors"
                placeholder="Confirm new password" />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Save New Password
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-3">
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>🔒 Browser Local Storage:</strong> Since there is no remote database, your new password is saved directly in your current browser. Agar aap kabhi password bhool gayein ya browser cache clear karlein, toh password automatically wapas default <code>jk@2024</code> pe set ho jaayega.
        </p>
      </div>
    </div>
  );
}
