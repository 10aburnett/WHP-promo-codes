'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Whop {
  id: string;
  name: string;
  slug: string;
  description?: string;
  rating: number;
  displayOrder: number;
  logo?: string;
  promoCodes: Array<{
    id: string;
    title: string;
    code: string;
    type: string;
    value: string;
  }>;
}

export default function WhopsAdmin() {
  const [whops, setWhops] = useState<Whop[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [selectedWhops, setSelectedWhops] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchWhops();
  }, []);

  const fetchWhops = async () => {
    try {
      const response = await fetch('/api/whops');
      if (response.ok) {
        const data = await response.json();
        setWhops(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching whops:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWhop = async (whopId: string, whopName: string) => {
    try {
      const response = await fetch(`/api/whops/${whopId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the whop from the local state
        setWhops(whops.filter(whop => whop.id !== whopId));
        alert(`Successfully deleted "${whopName}"`);
      } else {
        const error = await response.json();
        alert(`Failed to delete whop: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting whop:', error);
      alert(`Error deleting whop: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedWhops.size === 0) {
      alert('Please select at least one whop to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedWhops.size} selected whops? This action cannot be undone and will also delete all associated promo codes, reviews, and tracking data.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const selectedIds = Array.from(selectedWhops);
      
      const response = await fetch('/api/whops/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete whops: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      
      // Remove the deleted whops from the local state
      setWhops(whops.filter(whop => !selectedWhops.has(whop.id)));
      
      // Clear selection
      setSelectedWhops(new Set());
      setSelectAll(false);
      
      alert(result.message);
    } catch (error) {
      console.error('Failed to bulk delete whops:', error);
      alert(`Error deleting whops: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (whops.length === 0) {
      alert('No whops to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ALL ${whops.length} whops? This action cannot be undone and will also delete all associated promo codes, reviews, and tracking data.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/whops/delete-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete all whops: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      
      // Clear all whops from the local state
      setWhops([]);
      
      // Clear selection
      setSelectedWhops(new Set());
      setSelectAll(false);
      
      alert(result.message);
    } catch (error) {
      console.error('Failed to delete all whops:', error);
      alert(`Error deleting all whops: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectWhop = (whopId: string) => {
    const newSelected = new Set(selectedWhops);
    if (newSelected.has(whopId)) {
      newSelected.delete(whopId);
    } else {
      newSelected.add(whopId);
    }
    setSelectedWhops(newSelected);
    setSelectAll(newSelected.size === whops.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedWhops(new Set());
      setSelectAll(false);
    } else {
      setSelectedWhops(new Set(whops.map(whop => whop.id)));
      setSelectAll(true);
    }
  };

  const handleBulkImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;

    if (!file) {
      alert('Please select a CSV file');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const response = await fetch('/api/whops/bulk-import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setImportResult(`Success: ${result.message}`);
        fetchWhops(); // Refresh the list
      } else {
        setImportResult(`Error: ${result.error}`);
      }
    } catch (error) {
      setImportResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4">Loading whops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Whops Management</h1>
        <button
          onClick={() => router.push('/admin/whops/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add New Whop
        </button>
      </div>

      {/* Bulk Import Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Import Whops</h2>
        <p className="text-gray-600 mb-4">
          Upload a CSV file with columns: Name, AffiliateLink (required). Optional: Description, Logo, Price
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Price examples: $1,000.00, Free, $225.00 / month, €500.00, £199.00 / month, etc. Leave blank if no price.
        </p>
        
        <form onSubmit={handleBulkImport} className="space-y-4">
          <div>
            <input
              type="file"
              name="file"
              accept=".csv"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={importing}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
          >
            {importing ? 'Importing...' : 'Import CSV'}
          </button>
        </form>

        {importResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            importResult.startsWith('Success') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {importResult}
          </div>
        )}
      </div>

      {/* Whops List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Whops ({whops.length})</h2>
          
          {/* Bulk Actions */}
          <div className="flex gap-2">
            {selectedWhops.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg text-sm"
              >
                {isDeleting ? 'Deleting...' : `Delete Selected (${selectedWhops.size})`}
              </button>
            )}
            
            {whops.length > 0 && (
              <button
                onClick={handleDeleteAll}
                disabled={isDeleting}
                className="bg-red-800 hover:bg-red-900 disabled:bg-red-400 text-white px-4 py-2 rounded-lg text-sm"
              >
                {isDeleting ? 'Deleting...' : 'Delete All'}
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promo Codes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {whops.map((whop) => (
                <tr key={whop.id} className={`hover:bg-gray-50 ${selectedWhops.has(whop.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedWhops.has(whop.id)}
                      onChange={() => handleSelectWhop(whop.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{whop.name}</div>
                    <div className="text-sm text-gray-500">{whop.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {whop.description || "No description provided"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{whop.rating}/5</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {whop.promoCodes?.length || 0} codes
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/whops/${whop.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => router.push(`/admin/whops/${whop.id}/content`)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Content
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this whop?')) {
                          deleteWhop(whop.id, whop.name);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {whops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No whops found</p>
            <p className="text-gray-400 text-sm mt-2">Add your first whop or import from CSV</p>
          </div>
        )}
      </div>
    </div>
  );
} 