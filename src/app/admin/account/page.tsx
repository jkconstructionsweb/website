"use client";
import React, { useState, useEffect } from "react";
import { Shield, KeyRound, CheckCircle, Mail, AlertCircle, RefreshCw } from "lucide-react";

export default function AccountSettingsPage() {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  
  // States for Password Reset via OTP
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("jk_admin_email");
    if (savedEmail) setEmail(savedEmail);
    else setEmail("admin@jkconstructions.com"); // Fallback
  }, []);

  const handleStandardUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPass.length > 0 && newPass.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPass && newPass !== confirmPass) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "update_security", 
          currentPassword: currentPass, 
          newPassword: newPass || undefined,
          newEmail: email || undefined
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess("Security settings updated successfully!");
        localStorage.setItem("jk_admin_email", email);
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        setError(data.error || "Failed to update settings.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please ensure an email address is set.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setSuccess("An OTP has been sent to your email address!");
      } else {
        setError(data.error || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPass.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "otp_reset", 
          email,
          otp,
          newPassword: newPass
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess("Password recovered and updated successfully!");
        setIsForgotMode(false);
        setOtpSent(false);
        setOtp("");
        setNewPass("");
        setConfirmPass("");
      } else {
        setError(data.error || "Failed to verify OTP.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral/30">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary">Security Settings</h2>
              <p className="text-sm text-secondary/60">Update your admin credentials securely</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsForgotMode(!isForgotMode);
              setError(""); setSuccess(""); setOtpSent(false);
            }}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-lg"
          >
            {isForgotMode ? "Back to Standard Settings" : "Forgot Password?"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
            <CheckCircle size={18} /> {success}
          </div>
        )}

        {!isForgotMode ? (
          /* STANDARD UPDATE FORM */
          <form onSubmit={handleStandardUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">Recovery Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral/40 focus:border-primary outline-none text-sm font-semibold transition-colors"
                  placeholder="admin@jkconstructions.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">Current Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input type="password" required value={currentPass} onChange={e => setCurrentPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral/40 focus:border-primary outline-none text-sm font-semibold transition-colors"
                  placeholder="Verify your identity to make changes" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-neutral/20">
              <label className="block text-sm font-semibold text-secondary mb-2">New Password (Optional)</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral/40 focus:border-primary outline-none text-sm font-semibold transition-colors"
                  placeholder="Leave blank to keep current" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">Confirm New Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral/40 focus:border-primary outline-none text-sm font-semibold transition-colors"
                  placeholder="Confirm new password" />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                {loading && <RefreshCw size={16} className="animate-spin" />} Save Security Settings
              </button>
            </div>
          </form>
        ) : (
          /* OTP RESET FORM */
          <div className="space-y-5">
            {!otpSent ? (
              <div className="bg-neutral/5 p-6 rounded-xl border border-neutral/20 text-center">
                <Mail className="mx-auto text-primary mb-3" size={32} />
                <h3 className="text-lg font-bold text-secondary mb-2">Reset Password via Email</h3>
                <p className="text-sm text-secondary/70 mb-6">We will send a 6-digit One Time Password (OTP) to your recovery email: <strong>{email}</strong></p>
                <button onClick={handleSendOtp} disabled={loading} className="px-6 py-2.5 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-colors w-full flex items-center justify-center gap-2">
                   {loading && <RefreshCw size={16} className="animate-spin" />} Send Recovery OTP
                </button>
              </div>
            ) : (
              <form onSubmit={handleOtpReset} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">Enter 6-Digit OTP</label>
                  <input type="text" required value={otp} onChange={e => setOtp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-neutral/40 focus:border-primary outline-none text-sm font-bold tracking-widest transition-colors text-center"
                    placeholder="• • • • • •" maxLength={6} />
                </div>
                
                <div className="pt-4 border-t border-neutral/20">
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
                  <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    {loading && <RefreshCw size={16} className="animate-spin" />} Verify OTP & Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-start gap-3">
        <p className="text-sm text-emerald-800 leading-relaxed">
          <strong>🔐 Secure Database Auth:</strong> Your credentials are now fully encrypted and securely stored in your MongoDB Atlas cluster. The local storage fallback has been successfully disabled! Check your server console for the OTP testing output.
        </p>
      </div>
    </div>
  );
}
