'use client';

import { useState } from 'react';
import {
  UserIcon,
  PhoneIcon,
  UsersIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  school?: string;
  grade?: string;
}

interface Jurisdiction {
  state: string;
  county: string;
  caseNumber?: string;
}

export default function FamilyInfoPage() {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Mock data
  const parents: Parent[] = [
    {
      id: '1',
      name: 'Sarah Davidson',
      email: 'sarah@email.com',
      phone: '(555) 123-4567',
      address: '123 Main Street',
      city: 'Tampa',
      state: 'FL',
      zip: '33601',
    },
    {
      id: '2',
      name: 'Michael Davidson',
      email: 'michael@email.com',
      phone: '(555) 987-6543',
      address: '456 Oak Avenue',
      city: 'Tampa',
      state: 'FL',
      zip: '33602',
    },
  ];

  const children: Child[] = [
    {
      id: '1',
      name: 'Emma Davidson',
      dateOfBirth: '2018-03-15',
      age: 7,
      school: 'Riverside Elementary',
      grade: '2nd',
    },
    {
      id: '2',
      name: 'Jack Davidson',
      dateOfBirth: '2020-08-22',
      age: 5,
      school: 'Riverside Elementary',
      grade: 'K',
    },
  ];

  const jurisdiction: Jurisdiction = {
    state: 'Florida',
    county: 'Hillsborough County',
    caseNumber: '2024-DR-12345',
  };

  const SectionCard = ({
    id,
    title,
    icon: Icon,
    children,
  }: {
    id: string;
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <button
          onClick={() => setEditingSection(editingSection === id ? null : id)}
          className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
        >
          {editingSection === id ? (
            <CheckIcon className="w-5 h-5" />
          ) : (
            <PencilIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-2">
      <span className="text-sm text-gray-500 sm:w-32 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Resolve</span>
              </div>
              <nav className="flex space-x-1">
                <a href="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Dashboard
                </a>
                <a href="/course" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Course
                </a>
                <a href="/parenting-plan" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Parenting Plan
                </a>
                <a href="/family-info" className="px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg">
                  Family Info
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                SD
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Family Information</h1>
          <p className="text-gray-600">
            Review and update your family details used in your parenting plan.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Parents Information */}
          <SectionCard id="parents" title="Parents" icon={UsersIcon}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {parents.map((parent, index) => (
                <div
                  key={parent.id}
                  className={`${index > 0 ? 'md:border-l md:pl-6 border-gray-200' : ''}`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-600">
                        {parent.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{parent.name}</div>
                      <div className="text-sm text-gray-500">
                        {index === 0 ? 'Parent 1' : 'Parent 2'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-gray-400">Email:</span>
                      <span>{parent.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-gray-400">Phone:</span>
                      <span>{parent.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Contact Information */}
          <SectionCard id="contact" title="Contact & Addresses" icon={PhoneIcon}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {parents.map((parent, index) => (
                <div
                  key={parent.id}
                  className={`${index > 0 ? 'md:border-l md:pl-6 border-gray-200' : ''}`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-3">
                    {parent.name}'s Address
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{parent.address}</div>
                    <div>{parent.city}, {parent.state} {parent.zip}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Children Information */}
          <SectionCard id="children" title="Children" icon={UserIcon}>
            <div className="space-y-4">
              {children.map((child, index) => (
                <div
                  key={child.id}
                  className={`flex items-start space-x-4 ${
                    index > 0 ? 'pt-4 border-t border-gray-200' : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-primary">
                      {child.name.split(' ')[0][0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">{child.name}</div>
                      <div className="text-sm text-gray-500">{child.age} years old</div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div>
                        <span className="text-gray-400">Date of Birth:</span>{' '}
                        <span className="text-gray-600">
                          {new Date(child.dateOfBirth).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {child.school && (
                        <div>
                          <span className="text-gray-400">School:</span>{' '}
                          <span className="text-gray-600">{child.school}</span>
                        </div>
                      )}
                      {child.grade && (
                        <div>
                          <span className="text-gray-400">Grade:</span>{' '}
                          <span className="text-gray-600">{child.grade}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Jurisdiction */}
          <SectionCard id="jurisdiction" title="Jurisdiction" icon={MapPinIcon}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">State</div>
                <div className="text-sm font-medium text-gray-900">{jurisdiction.state}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">County</div>
                <div className="text-sm font-medium text-gray-900">{jurisdiction.county}</div>
              </div>
              {jurisdiction.caseNumber && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">Case Number</div>
                  <div className="text-sm font-medium text-gray-900">{jurisdiction.caseNumber}</div>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
