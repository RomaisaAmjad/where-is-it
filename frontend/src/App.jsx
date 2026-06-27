import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Loader, Inbox, Star, QuestionMark, Package, Home } from 'tabler-icons-react';
import ItemCard from './components/item-card.component';
import ItemModal from './components/item-modal.component';
import DeleteConfirmModal from './components/delete-confirm-modal.component';
import Pagination from './components/pagination.component';
import Toast from './components/toast-notification.component';
import * as itemService from './services/item.service';

export default function App() {
  // State variables
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 5
  });
  const [stats, setStats] = useState({
    totalItems: 0,
    frequentlyUsed: 0,
    roomsLogged: 0
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFrequentlyUsed, setShowFrequentlyUsed] = useState(false);
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete confirmation modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 400); // 400ms is standard for a premium typing response experience
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await itemService.getItems({
        page,
        limit: 5,
        search: debouncedSearch.trim() || undefined,
        is_frequently_used: showFrequentlyUsed,
      });

      if (data?.success) {
        setItems(data.data);
        setPagination(data.pagination);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      showToast('Failed to load items. Is the backend server running?', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, showFrequentlyUsed]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Toast triggering utility
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Add / Edit submission
  const handleFormSubmit = async (formData) => {
    try {
      if (editingItem) {
        const data = await itemService.updateItem(editingItem.item_id, formData);
        if (data.success) {
          showToast(`Updated "${formData.item_name}" successfully.`);
          setIsModalOpen(false);
          setEditingItem(null);
          fetchItems();
        }
      } else {
        const data = await itemService.createItem(formData);
        if (data.success) {
          showToast(`Added "${formData.item_name}" successfully.`);
          setIsModalOpen(false);
          fetchItems();
        }
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to save item. Please check inputs.';
      showToast(`${errMsg}`, 'error');
    }
  };

  // Toggle favorite quickly
  const handleToggleFavorite = async (item) => {
    try {
      const updatedStatus = !item.is_frequently_used;
      const data = await itemService.updateItem(item.item_id, {
        is_frequently_used: updatedStatus,
      });
      if (data.success) {
        showToast(
          updatedStatus
            ? `Pinned "${item.item_name}" to frequently used.`
            : `Unpinned "${item.item_name}" from frequently used.`
        );
        fetchItems();
      }
    } catch (error) {
      showToast('Failed to update favorite status.', 'error');
    }
  };

  // Delete item – open the confirmation modal
  const handleDelete = (itemId) => {
    setDeleteTargetId(itemId);
  };

  // Confirmed delete – actually call the API
  const handleDeleteConfirm = async () => {
    try {
      const data = await itemService.deleteItem(deleteTargetId);
      if (data.success) {
        showToast('Item deleted successfully.');
        fetchItems();
      }
    } catch (error) {
      showToast('Failed to delete item.', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setDeleteTargetId(null);
  };

  // Trigger editing state
  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Trigger add new state
  const handleAddNewClick = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Toggle Frequently Used Items Filter
  const handleFilterToggle = () => {
    setShowFrequentlyUsed((prev) => !prev);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-granny-canvas font-sans text-granny-text selection:bg-granny-accent/50 p-3 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col gap-4 md:gap-5">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-granny-panel/30 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-granny-text flex items-center gap-2">
              Where Is It
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-granny-salmon/20 border border-granny-salmon/40">
                <QuestionMark className="w-4 h-4 text-granny-salmon" />
              </span>
            </h1>
            <p className="text-granny-text/70 text-sm mt-0.5">
              Keep track of where all your items are placed so nothing ever gets lost.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddNewClick}
            className="flex items-center justify-center gap-2 bg-granny-salmon hover:bg-granny-salmon/95 text-white font-bold px-4 py-2 rounded-sm shadow-sm hover:shadow-md transition-smooth focus:outline-none focus:ring-2 focus:ring-granny-salmon active:scale-95 text-sm self-start md:self-auto cursor-pointer"
            aria-label="Add a new locator item"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </header>

        {/* Metrics Counter Bar */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          aria-label="Dashboard stats summary"
        >
          {/* Total Items */}
          <div className="bg-granny-panel/35 border border-granny-panel/60 rounded-md p-3 flex items-center justify-between hover:scale-[1.01] transition-smooth shadow-sm">
            <div>
              <span className="text-xs font-semibold tracking-wider text-granny-text/70 uppercase">
                Total Items
              </span>
              <span className="block text-2xl font-extrabold mt-0.5 text-granny-text">
                {stats.totalItems}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-granny-teal/20 border border-granny-teal/40 flex items-center justify-center">
              <Package className="w-5 h-5 text-granny-teal" />
            </div>
          </div>

          {/* Frequently Used */}
          <div className="bg-granny-panel/35 border border-granny-panel/60 rounded-md p-3 flex items-center justify-between hover:scale-[1.01] transition-smooth shadow-sm">
            <div>
              <span className="text-xs font-semibold tracking-wider text-granny-text/70 uppercase">
                Frequently Used
              </span>
              <span className="block text-2xl font-extrabold mt-0.5 text-granny-text">
                {stats.frequentlyUsed}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-granny-salmon/20 border border-granny-salmon/40 flex items-center justify-center">
              <Star className="w-5 h-5 text-granny-salmon" />
            </div>
          </div>

          {/* Rooms Logged */}
          <div className="bg-granny-panel/35 border border-granny-panel/60 rounded-md p-3 flex items-center justify-between hover:scale-[1.01] transition-smooth shadow-sm">
            <div>
              <span className="text-xs font-semibold tracking-wider text-granny-text/70 uppercase">
                Rooms Logged
              </span>
              <span className="block text-2xl font-extrabold mt-0.5 text-granny-text">
                {stats.roomsLogged}
              </span>
            </div>
            <div className="w-10 h-10 rounded-md bg-granny-accent/20 border border-granny-accent/40 flex items-center justify-center">
              <Home className="w-5 h-5 text-granny-accent" />
            </div>
          </div>
        </section>

        {/* Filters and Search Bar Row */}
        <section
          className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-granny-panel/20 p-1 rounded-xl border border-granny-panel/40"
          aria-label="Directory searching and filtering controls"
        >
          {/* Search Input Container */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-granny-text/45" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by item name, storage place, or room..."
              className="w-full pl-10 pr-4 py-2 bg-granny-canvas border border-granny-panel rounded-md text-granny-text placeholder-granny-text/40 focus:outline-none focus:ring-2 focus:ring-granny-salmon transition-smooth text-sm shadow-inner"
              aria-label="Search locator index"
            />
          </div>

          {/* Active Filter Toggle Button */}
          <button
            onClick={handleFilterToggle}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-bold tracking-wide transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-salmon cursor-pointer ${showFrequentlyUsed
              ? 'bg-granny-accent border-granny-accent text-granny-text shadow-md hover:brightness-95'
              : 'bg-granny-canvas border-granny-panel text-granny-text hover:bg-granny-panel/20'
              }`}
            aria-pressed={showFrequentlyUsed}
          >
            <Star className={`w-4 h-4 ${showFrequentlyUsed ? 'fill-current' : ''}`} />
          </button>
        </section>

        {/* Directory Listings Grid */}
        <main className="bg-granny-panel/25 border border-granny-panel/50 rounded-sm shadow-sm overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-granny-text/60">
              <Loader className="w-10 h-10 animate-spin text-granny-salmon" />
              <span className="text-sm font-semibold tracking-wide">Searching index files...</span>
            </div>
          ) : items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" role="table">
                <thead>
                  <tr className="bg-granny-panel/50 border-b border-granny-panel/80 align-middle">
                    <th scope="col" className="px-4 py-3 text-center text-xs tracking-wider text-granny-text/80 uppercase w-14">Pin</th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold tracking-wider text-granny-text/80 uppercase">Item Description</th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold tracking-wider text-granny-text/80 uppercase">Storage Location</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-bold tracking-wider text-granny-text/80 uppercase w-36">Room</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-bold tracking-wider text-granny-text/80 uppercase w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-granny-panel/30">
                  {items.map((item) => (
                    <ItemCard
                      key={item.item_id}
                      item={item}
                      onToggleFavorite={handleToggleFavorite}
                      onEdit={handleEditClick}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-granny-panel/40 border border-granny-panel flex items-center justify-center mb-4 text-granny-text/60">
                <Inbox className="w-8 h-8 text-granny-text/50" />
              </div>
              <h3 className="text-lg font-bold text-granny-text mb-1">No Items Found</h3>
              <p className="text-sm text-granny-text/70 max-w-sm">
                {search.trim() || showFrequentlyUsed
                  ? "We couldn't find matches for your active filters. Try adjusting your query or resetting filters."
                  : "Granny hasn't recorded any items yet. Get started by clicking 'Add New Item'."}
              </p>
              {(search.trim() || showFrequentlyUsed) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setShowFrequentlyUsed(false);
                  }}
                  className="mt-4 text-xs font-bold underline hover:text-granny-salmon text-granny-text/80 cursor-pointer"
                >
                  Clear all search filters
                </button>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && items.length > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </main>
      </div>

      {/* Item modal overlay */}
      <ItemModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={deleteTargetId !== null}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      {/* Toast state feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
