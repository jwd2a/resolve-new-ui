'use client';

import { SparklesIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import SectionSigningApproval from './SectionSigningApproval';

export default function TransportationExchangeForm() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [formData, setFormData] = useState({
    exchangeDistance: '',
    transportResponsibility: '',
    primaryLocation: '',
    gracePeriod: '',
    newPartnersAllowed: '',
    additionalProviders: '',
    delayProtocol: 'A delayed parent will text the other parent immediately with the new ETA; if the delay exceeds 30 minutes, a phone call is required.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsGenerated(true);
    // In real app, this would save to API and generate legal language
  };

  const handleEditAndRegenerate = () => {
    setIsGenerated(false);
    // In real app, this would allow editing the form
  };

  const handleApprove = (parent1Initials: string, parent2Initials: string) => {
    console.log('Approved with initials:', parent1Initials, parent2Initials);
    // In real app, this would save approval and navigate to next section
  };

  const handleSkip = () => {
    console.log('Skipping transportation and exchange');
    // In real app, this would navigate or save skip status
  };

  // Generate sample legal language based on form data
  const generatedLegalText = `
    <p>We agree that transportation and exchange of the child(ren) is an important aspect of our timesharing arrangement. We will work together to ensure smooth and timely exchanges that prioritize the children's needs and comfort.</p>

    <ul>
      <li>Exchanges will be ${formData.exchangeDistance === 'local' ? 'local (within 50 miles)' : formData.exchangeDistance === 'long-distance' ? 'long distance (over 50 miles)' : 'conducted as agreed'}</li>
      <li>${formData.transportResponsibility === 'receiving-parent' ? 'The receiving parent will pick up the child(ren)' : formData.transportResponsibility === 'dropping-parent' ? 'The dropping parent will deliver the child(ren)' : formData.transportResponsibility === 'shared' ? 'Both parents share transportation responsibility' : 'Transportation arrangements will be determined'}</li>
      <li>Primary exchange location will be ${formData.primaryLocation === 'parent-home' ? "at the parent's home" : formData.primaryLocation === 'school' ? 'at school' : formData.primaryLocation === 'public-location' ? 'at a mutually agreed public location' : 'at a location to be determined'}</li>
      <li>Grace period for lateness: ${formData.gracePeriod ? formData.gracePeriod.replace('-', ' ') : '30 minutes'}</li>
      <li>New partners at exchanges: ${formData.newPartnersAllowed === 'yes' ? 'Allowed' : formData.newPartnersAllowed === 'no' ? 'Not allowed' : formData.newPartnersAllowed === 'by-agreement' ? 'By mutual agreement only' : 'To be determined'}</li>
    </ul>

    <p><strong>Protocol for delays or schedule changes:</strong></p>
    <p>${formData.delayProtocol}</p>

    ${formData.additionalProviders ? `<p><strong>Additional authorized transportation providers:</strong> ${formData.additionalProviders}</p>` : ''}

    <p>Both parents agree to keep exchanges brief, neutral, and focused on the child(ren). We will avoid discussing adult matters during exchanges and will maintain a positive demeanor for the benefit of the child(ren).</p>
  `;

  // If generated, show signing approval
  if (isGenerated) {
    return (
      <SectionSigningApproval
        sectionTitle="Transportation and Exchange"
        generatedText={generatedLegalText}
        onEditAndRegenerate={handleEditAndRegenerate}
        onApprove={handleApprove}
        onSkip={handleSkip}
        parent1Name="Justin Davis"
        parent2Name="Co-Parent"
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Transportation and Exchange</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exchange Distance */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Will exchanges be local (within 50 miles) or long distance?
          </label>
          <select
            value={formData.exchangeDistance}
            onChange={(e) => setFormData({ ...formData, exchangeDistance: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select an option</option>
            <option value="local">Local</option>
            <option value="long-distance">Long Distance</option>
          </select>
        </div>

        {/* Transport Responsibility */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Who is responsible for transporting the children at the start/end of each time-sharing period?
          </label>
          <select
            value={formData.transportResponsibility}
            onChange={(e) => setFormData({ ...formData, transportResponsibility: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select an option</option>
            <option value="receiving-parent">Receiving parent picks up</option>
            <option value="dropping-parent">Dropping parent delivers</option>
            <option value="shared">Shared responsibility</option>
          </select>
        </div>

        {/* Exchange Location */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Exchange Location</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primary exchange location
            </label>
            <select
              value={formData.primaryLocation}
              onChange={(e) => setFormData({ ...formData, primaryLocation: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select an option</option>
              <option value="parent-home">At parent's home</option>
              <option value="school">At school</option>
              <option value="public-location">Public location</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Exchange Timing */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Exchange Timing</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Grace period before an arrival is considered late
            </label>
            <select
              value={formData.gracePeriod}
              onChange={(e) => setFormData({ ...formData, gracePeriod: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select an option</option>
              <option value="15-min">15 minutes</option>
              <option value="30-min">30 minutes</option>
              <option value="45-min">45 minutes</option>
              <option value="60-min">60 minutes</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Protocol for communicating delays or schedule changes
            </label>
            <textarea
              value={formData.delayProtocol}
              onChange={(e) => setFormData({ ...formData, delayProtocol: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Exchange Rules */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Exchange Rules</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Are new partners allowed to be present at exchanges?
            </label>
            <select
              value={formData.newPartnersAllowed}
              onChange={(e) => setFormData({ ...formData, newPartnersAllowed: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="by-agreement">By mutual agreement only</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional authorized transportation providers (optional)
            </label>
            <input
              type="text"
              value={formData.additionalProviders}
              onChange={(e) => setFormData({ ...formData, additionalProviders: e.target.value })}
              placeholder="Additional authorized transportation providers"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-4 pt-4">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>Generate</span>
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Skip 'Transportation and Exchange' and complete later
          </button>
        </div>
      </form>
    </div>
  );
}
