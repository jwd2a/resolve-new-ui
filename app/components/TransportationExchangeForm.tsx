'use client';

import { SparklesIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SectionSigningApproval from './SectionSigningApproval';
import { usePlan } from '@/app/PlanContext';

// Mock children data — in production this would come from context/API
const childrenWithDriver = [
  { id: '1', name: 'Emma Davidson', age: 16 },
  { id: '2', name: 'Jack Davidson', age: 7 },
  { id: '3', name: 'Lily Davidson', age: 5 },
];

const childrenNoDriver = [
  { id: '2', name: 'Jack Davidson', age: 7 },
  { id: '3', name: 'Lily Davidson', age: 5 },
];

export default function TransportationExchangeForm() {
  const { isProposed } = usePlan();
  const searchParams = useSearchParams();
  // Add ?nodriver to the URL to test without a driving-age child
  const noDriver = searchParams.get('nodriver') !== null;
  const mockChildren = noDriver ? childrenNoDriver : childrenWithDriver;

  const [isGenerated, setIsGenerated] = useState(false);
  const [selfTransport, setSelfTransport] = useState<string>('');
  const [transportsOthers, setTransportsOthers] = useState<string>('');
  const [formData, setFormData] = useState({
    exchangeDistance: '',
    transportResponsibility: '',
    primaryLocation: '',
    gracePeriod: '',
    newPartnersAllowed: '',
    additionalProviders: '',
    delayProtocol: 'A delayed parent will text the other parent immediately with the new ETA; if the delay exceeds 30 minutes, a phone call is required.',
  });

  const drivingAgeChildren = mockChildren.filter(c => c.age >= 16);
  const youngerChildren = mockChildren.filter(c => c.age < 16);
  const hasDrivingAgeChild = drivingAgeChildren.length > 0;
  const hasYoungerChildren = youngerChildren.length > 0;

  // Driving-age child handles everything — no further questions needed
  const allTransportHandled = selfTransport === 'yes' && (!hasYoungerChildren || transportsOthers === 'yes');
  // Show the main form when: no driving-age child, or they won't self-transport, or they can't transport the younger kids
  const showMainForm = !hasDrivingAgeChild || selfTransport === 'no' || (selfTransport === 'yes' && hasYoungerChildren && transportsOthers === 'no');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log('Form submitted:', formData);
    setIsGenerated(true);
    // In real app, this would save to API and generate legal language
  };

  const handleEditAndRegenerate = () => {
    setIsGenerated(false);
    // In real app, this would allow editing the form
  };

  const handleApprove = (initials: string) => {
    console.log('Approved with initials:', initials);
    // In real app, this would save approval and navigate to next section
  };

  const handleSkip = () => {
    console.log('Skipping transportation and exchange');
    // In real app, this would navigate or save skip status
  };

  // Generate sample legal language based on form data
  const drivingAgeNames = drivingAgeChildren.map(c => c.name.split(' ')[0]).join(' and ');
  const youngerNames = youngerChildren.map(c => c.name.split(' ')[0]).join(' and ');

  const drivingAgeLegalText = hasDrivingAgeChild && selfTransport === 'yes'
    ? `<p>${drivingAgeNames}, being of driving age, ${drivingAgeChildren.length === 1 ? 'is' : 'are'} permitted to transport ${drivingAgeChildren.length === 1 ? 'themselves' : 'themselves'} between households.</p>
       ${transportsOthers === 'yes' && hasYoungerChildren ? `<p>${drivingAgeNames} ${drivingAgeChildren.length === 1 ? 'is' : 'are'} also authorized to transport ${youngerNames} between households.</p>` : ''}`
    : '';

  const generatedLegalText = `
    <p>We agree that transportation and exchange of the child(ren) is an important aspect of our timesharing arrangement. We will work together to ensure smooth and timely exchanges that prioritize the children's needs and comfort.</p>

    ${drivingAgeLegalText}

    ${showMainForm ? `<ul>
      <li>Exchanges will be ${formData.exchangeDistance === 'local' ? 'local (within 50 miles)' : formData.exchangeDistance === 'long-distance' ? 'long distance (over 50 miles)' : 'conducted as agreed'}</li>
      <li>${formData.transportResponsibility === 'receiving-parent' ? 'The receiving parent will pick up the child(ren)' : formData.transportResponsibility === 'dropping-parent' ? 'The dropping parent will deliver the child(ren)' : formData.transportResponsibility === 'shared' ? 'Both parents share transportation responsibility' : 'Transportation arrangements will be determined'}</li>
      <li>Primary exchange location will be ${formData.primaryLocation === 'parent-home' ? "at the parent's home" : formData.primaryLocation === 'school' ? 'at school' : formData.primaryLocation === 'public-location' ? 'at a mutually agreed public location' : 'at a location to be determined'}</li>
      <li>Grace period for lateness: ${formData.gracePeriod ? formData.gracePeriod.replace('-', ' ') : '30 minutes'}</li>
      <li>New partners at exchanges: ${formData.newPartnersAllowed === 'yes' ? 'Allowed' : formData.newPartnersAllowed === 'no' ? 'Not allowed' : formData.newPartnersAllowed === 'by-agreement' ? 'By mutual agreement only' : 'To be determined'}</li>
    </ul>

    <p><strong>Protocol for delays or schedule changes:</strong></p>
    <p>${formData.delayProtocol}</p>

    ${formData.additionalProviders ? `<p><strong>Additional authorized transportation providers:</strong> ${formData.additionalProviders}</p>` : ''}` : ''}

    <p>Both parents agree to keep exchanges brief, neutral, and focused on the child(ren). We will avoid discussing adult matters during exchanges and will maintain a positive demeanor for the benefit of the child(ren).</p>
  `;

  // If generated, show signing approval (or simplified view in proposed mode)
  if (isGenerated) {
    if (isProposed) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Transportation and Exchange</h2>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: generatedLegalText }} />
            </div>

            <button
              onClick={handleEditAndRegenerate}
              className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm font-medium mt-6 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Edit Answers and regenerate this section</span>
            </button>
          </div>

          <button
            onClick={() => handleApprove('')}
            className="w-full py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Complete
          </button>
        </div>
      );
    }

    return (
      <SectionSigningApproval
        sectionTitle="Transportation and Exchange"
        generatedText={generatedLegalText}
        onEditAndRegenerate={handleEditAndRegenerate}
        onApprove={handleApprove}
        onSkip={handleSkip}
        parentName="Justin Davis"
        coParentName="Co-Parent"
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Transportation and Exchange</h2>

      {/* Driving-age child questions */}
      {hasDrivingAgeChild && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              You have {drivingAgeChildren.length === 1 ? 'a child' : 'children'} of driving age:{' '}
              <span className="font-semibold">{drivingAgeChildren.map(c => c.name.split(' ')[0]).join(', ')}</span>.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Will {drivingAgeChildren.length === 1 ? drivingAgeChildren[0].name.split(' ')[0] : 'they'} transport {drivingAgeChildren.length === 1 ? 'themselves' : 'themselves'}?
            </label>
            <select
              value={selfTransport}
              onChange={(e) => {
                setSelfTransport(e.target.value);
                if (e.target.value !== 'yes') setTransportsOthers('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {selfTransport === 'yes' && hasYoungerChildren && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Can {drivingAgeChildren.length === 1 ? drivingAgeChildren[0].name.split(' ')[0] : 'they'} also transport the younger {youngerChildren.length === 1 ? 'child' : 'children'} ({youngerChildren.map(c => c.name.split(' ')[0]).join(', ')})?
              </label>
              <select
                value={transportsOthers}
                onChange={(e) => setTransportsOthers(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          )}

          {allTransportHandled && (
            <div className="space-y-4 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
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
          )}
        </div>
      )}

      {/* Main transportation form — shown when driving-age child won't handle everything */}
      {showMainForm && (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contextual header for younger children */}
        {hasDrivingAgeChild && hasYoungerChildren && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              For the {youngerChildren.length === 1 ? 'child' : 'children'} not of driving age ({youngerChildren.map(c => c.name.split(' ')[0]).join(', ')}), how will transportation be handled?
            </p>
          </div>
        )}

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
      )}
    </div>
  );
}
