import React, { useEffect, useState, useCallback } from 'react';
import config from '../constants.js';
import { ArrowRightOnRectangleIcon, PlusIcon, PhotoIcon, TrashIcon, PencilIcon, MoonIcon, UserCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [cookies, setCookies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadCookies = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await manifest.from('Cookie').find({ include: ['owner'], sort: { createdAt: 'desc' } });
      if(response && response.data) {
        setCookies(response.data);
      }
    } catch (error) {
      console.error('Failed to load cookies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [manifest]);

  useEffect(() => {
    loadCookies();
  }, [loadCookies]);

  const handleCookieCreated = (newCookie) => {
    setCookies(prevCookies => [newCookie, ...prevCookies]);
    setShowForm(false);
  };
  
  const handleCookieUpdated = (updatedCookie) => {
    setCookies(cookies.map(c => c.id === updatedCookie.id ? updatedCookie : c));
  }

  const handleDeleteCookie = async (cookieId) => {
    if (window.confirm('Are you sure you want to jettison this cookie into space?')) {
      try {
        await manifest.from('Cookie').delete(cookieId);
        setCookies(cookies.filter(c => c.id !== cookieId));
      } catch (error) {
        console.error('Failed to delete cookie:', error);
        alert('Could not delete cookie.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MoonIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Moon Cookies Mission Control</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className='font-semibold text-gray-800'>{user.name}</p>
                <p className='text-sm text-gray-500 capitalize'>{user.role}</p>
            </div>
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
            <button onClick={onLogout} className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700">
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Cookie Inventory</h2>
          {user.role === 'astronaut' && (
            <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              {showForm ? 'Cancel' : 'Bake New Cookie'}
            </button>
          )}
        </div>

        {showForm && user.role === 'astronaut' && <CookieForm user={user} manifest={manifest} onCookieCreated={handleCookieCreated} />}

        {isLoading ? (
          <p>Loading lunar inventory...</p>
        ) : cookies && cookies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cookies.map(cookie => (
              <CookieCard key={cookie.id} cookieData={cookie} currentUser={user} onDelete={handleDeleteCookie} onUpdate={handleCookieUpdated} manifest={manifest}/>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <RocketLaunchIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cookies found</h3>
            <p className="mt-1 text-sm text-gray-500">Looks like the ovens are cold. Bake the first batch!</p>
          </div>
        )}
      </main>
    </div>
  );
};

const CookieForm = ({ user, manifest, onCookieCreated, existingCookie, onDone }) => {
  const [cookie, setCookie] = useState(existingCookie || { name: '', description: '', price: 0, inventory: 0, bakingStatus: 'dough', photo: null });
  const [preview, setPreview] = useState(existingCookie?.photo?.thumbnail.url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bakingStatusOptions = ['dough', 'in_the_oven', 'ready_for_sale'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCookie(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    if (file) {
      setCookie(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...cookie, ownerId: user.id, price: parseFloat(cookie.price), inventory: parseInt(cookie.inventory) };
      if(existingCookie) {
        const updatedCookie = await manifest.from('Cookie').update(existingCookie.id, payload);
        onCookieCreated(updatedCookie); // We can reuse this to update the list
      } else {
        const newCookie = await manifest.from('Cookie').create(payload);
        onCookieCreated(newCookie);
      }
      if(onDone) onDone();
    } catch (error) {
      console.error('Failed to save cookie:', error);
      alert('Failed to save cookie. Please check the console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 space-y-4">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
            <label className="block text-sm font-medium text-gray-700">Cookie Name</label>
            <input type="text" name="name" value={cookie.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Baking Status</label>
            <div className="flex space-x-2 mt-2">
                {bakingStatusOptions.map(status => (
                    <button type="button" key={status} onClick={() => setCookie(prev => ({...prev, bakingStatus: status}))} className={`px-3 py-1 text-sm rounded-full ${cookie.bakingStatus === status ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" value={cookie.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
            <input type="number" name="price" value={cookie.price} onChange={handleChange} step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Inventory</label>
            <input type="number" name="inventory" value={cookie.inventory} onChange={handleChange} step="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Photo</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {preview ? <img src={preview} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-md" /> : <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />}
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                <span>Upload a file</span>
                <input id="file-upload" name="photo" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files[0])} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        {onDone && <button type="button" onClick={onDone} className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">Cancel</button>}
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
          {isSubmitting ? 'Saving...' : (existingCookie ? 'Save Changes' : 'Add Cookie')}
        </button>
      </div>
    </form>
  );
};

const CookieCard = ({ cookieData, currentUser, onDelete, onUpdate, manifest }) => {
  const [isEditing, setIsEditing] = useState(false);
  const statusColors = {
    dough: 'bg-yellow-100 text-yellow-800',
    in_the_oven: 'bg-orange-100 text-orange-800',
    ready_for_sale: 'bg-green-100 text-green-800'
  };
  
  const handleUpdate = (updatedCookie) => {
    onUpdate(updatedCookie);
    setIsEditing(false);
  }

  if (isEditing) {
    return <CookieForm user={currentUser} manifest={manifest} existingCookie={cookieData} onCookieCreated={handleUpdate} onDone={() => setIsEditing(false)} />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img src={cookieData.photo?.thumbnail.url || 'https://placehold.co/400x400/0f172a/FFF?text=Moon+Cookie'} alt={cookieData.name} className="h-48 w-full object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{cookieData.name}</h3>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[cookieData.bakingStatus] || 'bg-gray-100 text-gray-800'}`}>
            {cookieData.bakingStatus.replace('_', ' ')}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 truncate">{cookieData.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-indigo-600">${parseFloat(cookieData.price).toFixed(2)}</p>
          <p className="text-sm text-gray-500">{cookieData.inventory} in stock</p>
        </div>
        {cookieData.owner && (
          <p className="text-xs text-gray-400 mt-2">Baked by: {cookieData.owner.name}</p>
        )}
        {currentUser && cookieData.owner && currentUser.id === cookieData.owner.id && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
            <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100">
              <PencilIcon className="h-5 w-5" />
            </button>
            <button onClick={() => onDelete(cookieData.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
