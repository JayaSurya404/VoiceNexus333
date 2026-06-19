"use client";

import { useState } from "react";
import { PhoneCall, Loader2, Bot, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [leadName, setLeadName] = useState("");
  const [businessContext, setBusinessContext] = useState("We are 'TechNova Solutions'. We sell premium web development services. Ask the user if they are currently looking to upgrade their website, and if they are, tell them we have a 20% discount this month.")
  const [status, setStatus] = useState<"idle" | "calling" | "connected" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCallLead = async () => {
    if (!phoneNumber) return;
    
    setStatus("calling");
    setErrorMessage("");

    try {
      // FIX: Changed from /incoming to /outbound so the frontend receives JSON, not XML.
      const response = await fetch("https://voicenexus-api.onrender.com/api/call/outbound", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetPhone: phoneNumber,
          // Twilio will use this Render URL to connect the audio stream
          ngrokUrl: "https://voicenexus-api.onrender.com",
          leadName: leadName,
          businessContext: businessContext 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate call");
      }

      setStatus("connected");
      
      // Reset back to idle after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);

    } catch (error: any) {
      console.error("Call Error:", error);
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">VoiceNexus AI</h1>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-slate-200 px-4 py-2 rounded-full">
            Enterprise Dashboard
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Action Card */}
          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Initiate AI Follow-up</h2>
            <p className="text-slate-500 mb-8">
              Enter a lead's phone number below. Our AI will instantly call, qualify the lead, and update the CRM.
            </p>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lead Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none text-slate-900 mb-4"
                />
                
                <label className="block text-sm font-medium text-slate-700 mb-2">AI Business Prompt (How should the AI act?)</label>
                <textarea
                  rows={4}
                  value={businessContext}
                  onChange={(e) => setBusinessContext(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none text-slate-900 mb-4"
                />
              </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lead Phone Number (Include Country Code)
                </label>
                <input
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-900"
                />
              </div>

              <button
                onClick={handleCallLead}
                disabled={status === "calling" || !phoneNumber}
                className="mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                {status === "calling" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting to Telephony...
                  </>
                ) : status === "connected" ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Call Dispatched!
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-5 h-5" />
                    Dispatch AI Agent
                  </>
                )}
              </button>

              {status === "error" && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="col-span-1 flex flex-col gap-4">
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <h3 className="text-slate-400 text-sm font-medium mb-1">AI Minutes Used</h3>
              <div className="text-3xl font-bold">14s / 500m</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Active Leads</h3>
              <div className="text-3xl font-bold text-slate-900">1</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}