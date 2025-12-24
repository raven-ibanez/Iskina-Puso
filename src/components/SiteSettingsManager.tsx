import React, { useState } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useImageUpload } from '../hooks/useImageUpload';

const SiteSettingsManager: React.FC = () => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();
  const { uploadImage, uploading } = useImageUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    currency: '',
    currency_code: '',
    opening_time: '',
    closing_time: '',
    is_temporarily_closed: false
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  React.useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code,
        opening_time: siteSettings.opening_time,
        closing_time: siteSettings.closing_time,
        is_temporarily_closed: siteSettings.is_temporarily_closed
      });
      setLogoPreview(siteSettings.site_logo);
    }
  }, [siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let logoUrl = logoPreview;

      // Upload new logo if selected
      if (logoFile) {
        const uploadedUrl = await uploadImage(logoFile);
        logoUrl = uploadedUrl;
      }

      // Update all settings
      await updateSiteSettings({
        site_name: formData.site_name,
        site_description: formData.site_description,
        currency: formData.currency,
        currency_code: formData.currency_code,
        opening_time: formData.opening_time,
        closing_time: formData.closing_time,
        is_temporarily_closed: formData.is_temporarily_closed,
        site_logo: logoUrl
      });

      setIsEditing(false);
      setLogoFile(null);
    } catch (error) {
      console.error('Error saving site settings:', error);
    }
  };

  const handleCancel = () => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code,
        opening_time: siteSettings.opening_time,
        closing_time: siteSettings.closing_time,
        is_temporarily_closed: siteSettings.is_temporarily_closed
      });
      setLogoPreview(siteSettings.site_logo);
    }
    setIsEditing(false);
    setLogoFile(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-noto font-semibold text-black">Site Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Edit Settings</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{uploading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Site Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Logo
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Site Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl text-gray-400">☕</div>
              )}
            </div>
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Logo</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Site Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="site_name"
              value={formData.site_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter site name"
            />
          ) : (
            <p className="text-lg font-medium text-black">{siteSettings?.site_name}</p>
          )}
        </div>

        {/* Site Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Description
          </label>
          {isEditing ? (
            <textarea
              name="site_description"
              value={formData.site_description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter site description"
            />
          ) : (
            <p className="text-gray-600">{siteSettings?.site_description}</p>
          )}
        </div>

        {/* Currency Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Symbol
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., ₱, $, €"
              />
            ) : (
              <p className="text-lg font-medium text-black">{siteSettings?.currency}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Code
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currency_code"
                value={formData.currency_code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., PHP, USD, EUR"
              />
            ) : (
              <p className="text-lg font-medium text-black">{siteSettings?.currency_code}</p>
            )}
          </div>
        </div>

        {/* Store Hours & Status */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-medium text-black mb-4">Store Hours & Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opening Time
              </label>
              {isEditing ? (
                <input
                  type="time"
                  name="opening_time"
                  value={formData.opening_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              ) : (
                <p className="text-lg font-medium text-black">
                  {new Date(`2000-01-01T${siteSettings?.opening_time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closing Time
              </label>
              {isEditing ? (
                <input
                  type="time"
                  name="closing_time"
                  value={formData.closing_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              ) : (
                <p className="text-lg font-medium text-black">
                  {new Date(`2000-01-01T${siteSettings?.closing_time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-base font-medium text-black">Temporary Close</h4>
                <p className="text-sm text-gray-500">
                  Temporarily stop accepting orders (e.g., for emergency or maintenance)
                </p>
              </div>
              {isEditing ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_temporarily_closed}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_temporarily_closed: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${siteSettings?.is_temporarily_closed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {siteSettings?.is_temporarily_closed ? 'Closed' : 'Open'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
