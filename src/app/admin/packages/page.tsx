"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, RefreshCw } from "lucide-react";

interface Game {
  id: string;
  name: string;
}

interface Package {
  _id: string;
  game_id: { _id: string; name: string };
  name: string;
  price: number;
  original_price: number;
  diamonds: number;
  is_popular: boolean;
  active: boolean;
  category?: string;
  badge?: string;
  sort_order?: number;
}

interface Category {
  _id: string;
  name: string;
  sort_order: number;
}

export default function AdminPackagesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [diamonds, setDiamonds] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [active, setActive] = useState(true);
  const [category, setCategory] = useState("Normal Top-Up");
  const [badge, setBadge] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSortOrder, setCatSortOrder] = useState("0");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (selectedGameId) {
      fetchPackages(selectedGameId);
      fetchCategories(selectedGameId);
    } else {
      setPackages([]);
      setCategories([]);
    }
  }, [selectedGameId]);

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      if (Array.isArray(data)) {
        setGames(data);
        if (data.length > 0) setSelectedGameId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPackages = async (gameId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/packages?gameId=${gameId}`);
      const data = await res.json();
      if (Array.isArray(data)) setPackages(data);
      else setPackages([]);
    } catch (err) {
      console.error(err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (gameId: string) => {
    try {
      const res = await fetch(`/api/categories?gameId=${gameId}`);
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    if (!selectedGameId) {
      alert("Please select a game first");
      return;
    }
    setEditingId(null);
    setName(""); setPrice(""); setOriginalPrice(""); setDiamonds(""); setImageUrl(""); setIsPopular(false); setActive(true); setCategory(categories.length > 0 ? categories[0].name : "Normal Top-Up"); setBadge(""); setSortOrder("0");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditingId(pkg._id);
    setName(pkg.name);
    setPrice(pkg.price.toString());
    setOriginalPrice((pkg.original_price || 0).toString());
    setDiamonds(pkg.diamonds.toString());
    setImageUrl(pkg.image_url || "");
    setIsPopular(pkg.is_popular);
    setActive(pkg.active);
    setCategory(pkg.category || "Normal Top-Up");
    setBadge(pkg.badge || "");
    setSortOrder((pkg.sort_order || 0).toString());
    setError("");
    setShowModal(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const url = editingId ? `/api/packages/${editingId}` : "/api/packages";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: selectedGameId,
          name,
          price: parseFloat(price),
          original_price: parseFloat(originalPrice || "0"),
          diamonds: parseInt(diamonds),
          image_url: imageUrl || undefined,
          is_popular: isPopular,
          active,
          category,
          badge,
          sort_order: parseInt(sortOrder) || 0,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        fetchPackages(selectedGameId);
      } else {
        setError(data.error || "Failed to save package");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPackages(selectedGameId);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      const url = editingCatId ? `/api/categories/${editingCatId}` : "/api/categories";
      const method = editingCatId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: selectedGameId,
          name: catName,
          sort_order: parseInt(catSortOrder) || 0,
        }),
      });
      if (res.ok) {
        fetchCategories(selectedGameId);
        if (editingCatId) {
          fetchPackages(selectedGameId); // Refresh packages in case category name changed
        }
        setCatName("");
        setCatSortOrder("0");
        setEditingCatId(null);
      } else {
        alert("Failed to save category");
      }
    } catch (err) {
      alert("Error saving category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Packages in this category will remain, but the category won't be sortable.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories(selectedGameId);
    } catch (err) {}
  };

  const handleSyncG2Bulk = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/g2bulk-sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Synced successfully");
        if (selectedGameId) fetchPackages(selectedGameId);
      } else {
        alert(data.error || "Failed to sync");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during sync");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Manage Packages</h2>
          <p className="text-gray-400 text-sm">Add or edit top-up packages for your games.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="" disabled className="bg-[#090B12]">Select a Game</option>
            {games.map(game => (
              <option key={game.id} value={game.id} className="bg-[#090B12]">{game.name}</option>
            ))}
          </select>

          <button 
            onClick={handleSyncG2Bulk}
            disabled={isSyncing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Syncing..." : "Sync G2Bulk"}
          </button>

          <button 
            onClick={() => setShowCategoryModal(true)}
            disabled={!selectedGameId}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            Manage Categories
          </button>

          <button 
            onClick={openAddModal}
            disabled={!selectedGameId}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors glow-primary whitespace-nowrap disabled:opacity-50"
          >
            <Plus size={16} /> Add Package
          </button>
        </div>
      </div>

      <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Package Name</th>
                <th className="px-6 py-4 font-medium">Amount (Diamonds)</th>
                <th className="px-6 py-4 font-medium">Cost Price</th>
                <th className="px-6 py-4 font-medium">Selling Price</th>
                <th className="px-6 py-4 font-medium">Profit</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Badge</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {!selectedGameId ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Please select a game first.</td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading packages...</td>
                </tr>
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No packages found for this game.</td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                      {pkg.image_url && (
                        <img src={pkg.image_url} alt={pkg.name} className="w-8 h-8 object-contain rounded-md bg-white/5 p-1" />
                      )}
                      {pkg.name}
                    </td>
                    <td className="px-6 py-4 text-primary font-bold">{pkg.diamonds}</td>
                    <td className="px-6 py-4 text-gray-400 font-medium">${(pkg.original_price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-green-400 font-bold">${pkg.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-[#00E5FF] font-medium">+${(pkg.price - (pkg.original_price || 0)).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/10 rounded-md text-gray-300 text-xs font-medium">
                        {pkg.category || "Normal Top-Up"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {pkg.badge ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/20">{pkg.badge}</span>
                      ) : pkg.is_popular ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/20">Hot</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{pkg.sort_order || 0}</td>
                    <td className="px-6 py-4">
                      {pkg.active ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success border border-success/20">Active</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(pkg)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeletePackage(pkg._id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-6">{editingId ? "Edit Package" : "Add New Package"}</h3>
            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Package Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" placeholder="e.g., 50 Diamonds" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Amount (Diamonds)</label>
                  <input required type="number" min="0" value={diamonds} onChange={(e) => setDiamonds(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" placeholder="e.g., 50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Custom Image URL (Optional)</label>
                  <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" placeholder="e.g., /images/weekly.png" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary">
                    {categories.length > 0 ? categories.map(cat => (
                      <option key={cat._id} value={cat.name} className="bg-[#090B12]">{cat.name}</option>
                    )) : (
                      <option value="Normal Top-Up" className="bg-[#090B12]">Normal Top-Up</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Cost Price (USD)</label>
                  <input required type="number" min="0" step="0.001" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" placeholder="e.g., 0.80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Selling Price (USD)</label>
                  <div className="relative">
                    <input required type="number" min="0" step="0.001" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" placeholder="e.g., 1.00" />
                    {price && originalPrice && (
                      <div className="absolute right-3 top-2.5 text-xs font-bold text-[#00E5FF]">
                        Profit: +${(parseFloat(price) - parseFloat(originalPrice)).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Custom Badge (e.g., Best Selling)</label>
                  <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" placeholder="e.g., 50% Off" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Display Order (0 is first)</label>
                  <input required type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" placeholder="e.g., 1" />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={active} onChange={(e) => setActive(e.target.checked)} className="rounded border-gray-600 bg-white/5 w-4 h-4" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-300">Active</label>
                </div>
              </div>
              
              {error && <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">{error}</div>}
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Manage Categories Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Manage Categories</h3>
            
            <div className="mb-6 max-h-60 overflow-y-auto space-y-2 pr-2">
              {categories.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No categories created yet.</p>
              ) : (
                categories.map(cat => (
                  <div key={cat._id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <div className="text-white font-medium">{cat.name}</div>
                      <div className="text-gray-400 text-xs">Order: {cat.sort_order}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingCatId(cat._id); setCatName(cat.name); setCatSortOrder(cat.sort_order.toString()); }} className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-md"><Edit2 size={14}/></button>
                      <button onClick={() => handleDeleteCategory(cat._id)} className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded-md"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="text-sm font-medium text-white mb-2">{editingCatId ? "Edit Category" : "Add New Category"}</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <input required type="text" value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Category Name" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <input required type="number" value={catSortOrder} onChange={(e) => setCatSortOrder(e.target.value)} placeholder="Order (0)" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                {editingCatId && (
                  <button type="button" onClick={() => { setEditingCatId(null); setCatName(""); setCatSortOrder("0"); }} className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors">Cancel Edit</button>
                )}
                <button type="submit" className="flex-1 px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors">
                  {editingCatId ? "Update" : "Add Category"}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10">
              <button type="button" onClick={() => setShowCategoryModal(false)} className="w-full px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
