import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Info } from "lucide-react";

export default function ContactForm({ settings }: { settings?: any }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-xs font-black text-[#1877F2] uppercase tracking-widest mb-1">CUSTOMER HELPDESK</p>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">GET IN TOUCH</h1>
        <p className="text-slate-500 text-xs mt-2">We typically reply within 1-2 hours on business days.</p>
        <div className="h-1 w-16 bg-[#1877F2] mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Direct Helplines */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider mb-6">Support Channels</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-blue-50 text-[#1877F2] rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Phone Call Helpline</h4>
                  <p className="text-sm text-[#1877F2] font-black mt-1">
                    <a href={`tel:${settings?.customerSupportPhone || "+8801711111111"}`} className="hover:underline">
                      {settings?.customerSupportPhone || "+880 1711-111111"}
                    </a>
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Available 10:00 AM - 10:00 PM</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-blue-50 text-[#1877F2] rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Email Correspondence</h4>
                  <p className="text-sm text-slate-700 font-bold mt-1">
                    <a href={`mailto:${settings?.emailSupport || "support@youngstyle.com"}`} className="text-[#1877F2] hover:underline">
                      {settings?.emailSupport || "support@youngstyle.com"}
                    </a>
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">For queries, order updates, & details</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-blue-50 text-[#1877F2] rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Flagship Showroom</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    House 45, Road 12, Sector 5, Uttara, Dhaka-1230, Bangladesh
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Quick Launch buttons */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Instant Chat</h3>
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors uppercase"
            >
              <MessageCircle className="w-4 h-4 fill-current" /> Live WhatsApp Chat
            </a>
            <a
              href="https://m.me/youngstyle"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors uppercase"
            >
              <Send className="w-4 h-4" /> Live Facebook Messenger
            </a>
          </div>
        </div>

        {/* Middle Column: Interactive Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider mb-6">Dispatch a Message</h3>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs font-semibold animate-scale-up">
                🎉 Your message was sent successfully! Our helpdesk will contact you shortly.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                    placeholder="e.g. 017XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                    placeholder="Message topic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] text-slate-800 focus:outline-hidden"
                  placeholder="How can our style support team assist you?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 btn-primary-gradient text-white rounded-xl text-xs font-black uppercase tracking-widest inline-flex items-center justify-center gap-2 shadow-md hover:shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {loading ? "Sending Message..." : "Submit Message"}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Styled Google Maps Look-alike (No script lag, very premium look) */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xs h-[250px] relative">
            <div className="absolute inset-0 bg-[#E5E3DF] flex flex-col items-center justify-center text-center p-4">
              {/* Modern Grid line overlay to feel like a high tech map */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <MapPin className="w-10 h-10 text-red-500 animate-bounce relative z-10" />
              <h4 className="font-extrabold text-slate-800 text-sm mt-3 relative z-10">YOUNG Style Showroom Location</h4>
              <p className="text-[11px] text-slate-500 mt-1 relative z-10 max-w-sm">
                House 45, Road 12, Sector 5, Uttara, Dhaka-1230. Next to Uttara Mascot Plaza.
              </p>
              
              {/* Outer map helper */}
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 px-4 py-2 bg-white text-slate-800 hover:bg-[#1877F2] hover:text-white border border-slate-200 hover:border-[#1877F2] text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-xs relative z-10 transition-all"
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
