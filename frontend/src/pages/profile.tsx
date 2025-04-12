import React from 'react';
import { useParams } from 'react-router-dom';

export function ProfilePage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-gray-600">User ID: {id}</p>
    </div>
  );
}