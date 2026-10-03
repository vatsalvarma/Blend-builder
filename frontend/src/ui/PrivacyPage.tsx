import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-cream p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-heading text-accent">Privacy Notice</h1>
        <p className="text-muted">Last updated: October 2026</p>
        
        <div className="space-y-4 text-sm leading-relaxed text-muted bg-card p-6 rounded-xl border border-white/5">
          <h2 className="text-xl font-heading text-cream">1. Who we are</h2>
          <p>We are Blend Builder, operated by Vasavi. This notice explains how we collect and use your data when you request a coffee sample.</p>
          
          <h2 className="text-xl font-heading text-cream mt-6">2. What we collect</h2>
          <p>We collect your Name, Cafe Name, City, and Mobile Number solely to fulfill your sample request and contact you about the coffee.</p>
          
          <h2 className="text-xl font-heading text-cream mt-6">3. Why we need it</h2>
          <p>We need this information to roast your specific blend, package it, and reach out to arrange delivery or gather feedback.</p>
          
          <h2 className="text-xl font-heading text-cream mt-6">4. Data Retention</h2>
          <p>Your details are kept securely in our system. If a sample does not result in an ongoing supply arrangement, your contact details will be deleted from our active database after our standard retention period.</p>
          
          <h2 className="text-xl font-heading text-cream mt-6">5. Your Rights</h2>
          <p>You can request deletion of your data at any time by contacting us on WhatsApp.</p>
        </div>
      </div>
    </div>
  );
}
