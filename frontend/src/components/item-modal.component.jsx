import React, { useState, useEffect, useRef } from 'react';
import { X } from 'tabler-icons-react';

export default function ItemModal({ isOpen, item, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    item_name: '',
    storage_place: '',
    room: '',
    is_frequently_used: false
  });

  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  // Pre-populate fields on edit
  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name || '',
        storage_place: item.storage_place || '',
        room: item.room || '',
        is_frequently_used: !!item.is_frequently_used
      });
    } else {
      setFormData({
        item_name: '',
        storage_place: '',
        room: '',
        is_frequently_used: false
      });
    }
    setErrors({});
  }, [item, isOpen]);

  // Handle Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Simple focus trap: focus the first input field
      const timer = setTimeout(() => {
        const firstInput = modalRef.current?.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 50);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      is_frequently_used: !prev.is_frequently_used
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.item_name.trim()) {
      newErrors.item_name = 'Item name is required';
    } else if (formData.item_name.length > 100) {
      newErrors.item_name = 'Item name cannot exceed 100 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-granny-text/40 backdrop-blur-sm flex items-center justify-center p-3 z-50 transition-all duration-300"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-granny-canvas border border-granny-panel w-full max-w-lg rounded-2xl shadow-2xl p-5 md:p-6 flex flex-col relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-granny-text/50 hover:text-granny-salmon hover:bg-granny-salmon/10 rounded-sm transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-salmon"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="modal-title" className="text-xl font-bold tracking-wide text-granny-text mb-4">
          {item ? 'Edit Item' : ' Add New Item'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Item Name */}
          <div>
            <label htmlFor="item_name" className="block text-sm tracking-wide text-granny-text mb-1.5">
              Item Name <span className="text-granny-salmon">*</span>
            </label>
            <input
              type="text"
              id="item_name"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              placeholder="e.g. Reading Glasses, Sewing Box"
              className={`w-full px-2 py-1 bg-granny-panel/20 border rounded-sm text-granny-text placeholder-granny-text/40 focus:outline-none focus:ring-2 focus:ring-granny-salmon transition-smooth ${errors.item_name ? 'border-granny-salmon' : 'border-granny-panel'
                }`}
            />
            {errors.item_name && (
              <span className="text-xs font-semibold text-granny-salmon mt-1 block">
                {errors.item_name}
              </span>
            )}
          </div>

          {/* Storage Place */}
          <div>
            <label htmlFor="storage_place" className="block text-sm tracking-wide text-granny-text mb-1.5">
              Where is it? (Storage Location)
            </label>
            <textarea
              id="storage_place"
              name="storage_place"
              value={formData.storage_place}
              onChange={handleChange}
              rows="2"
              placeholder="e.g. Second drawer of the side table next to the window"
              className="w-full px-2 py-1 bg-granny-panel/20 border border-granny-panel rounded-sm text-granny-text placeholder-granny-text/40 focus:outline-none focus:ring-2 focus:ring-granny-salmon transition-smooth resize-none"
            />
          </div>

          {/* Room */}
          <div>
            <label htmlFor="room" className="block text-sm tracking-wide text-granny-text mb-1.5">
              Room Location
            </label>
            <input
              type="text"
              id="room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="e.g. Living Room, Bedroom, Kitchen"
              className="w-full px-2 py-1 bg-granny-panel/20 border border-granny-panel rounded-sm text-granny-text placeholder-granny-text/40 focus:outline-none focus:ring-2 focus:ring-granny-salmon transition-smooth"
            />
          </div>

          {/* Is Frequently Used Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-b border-granny-panel/30 my-1">
            <div>
              <span className="block text-sm tracking-wide text-granny-text">
                Frequently Used
              </span>
              <span className="block text-xs text-granny-text/60">
                Pin to the top and highlight on the dashboard
              </span>
            </div>
            {/* Visual Toggle Slider */}
            <button
              type="button"
              onClick={handleToggle}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-salmon ${formData.is_frequently_used ? 'bg-granny-teal' : 'bg-granny-panel'
                }`}
              aria-pressed={formData.is_frequently_used}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-smooth ${formData.is_frequently_used ? 'translate-x-6' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded-sm border border-granny-panel text-sm text-granny-text hover:bg-granny-panel/30 font-semibold tracking-wide transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-sm bg-granny-salmon text-sm text-white hover:bg-granny-salmon/90 font-semibold tracking-wide shadow-md hover:shadow-lg transition-smooth focus:ring-2 focus:ring-granny-salmon/65 focus:outline-none"
            >
              {item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
