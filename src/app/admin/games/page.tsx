"use client";

import { useState, useEffect, useMemo } from "react";
import { Save, Search, CheckCircle, Plus } from "lucide-react";
import Image from "next/image";

interface G2BulkGame {
  id: number;
  code: string;
  name: string;
  image_url: string;
}

interface LocalGame {
  _id: string;
  id_string: string;
  name: string;
  active: boolean;
}

export default function AdminGamesPage() {
  const [g2bulkGames, setG2bulkGames] = useState<G2BulkGame[]>([]);
  const [localGames, setLocalGames] = useState<LocalGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [search, setSearch] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [g2bulkRes, localRes] = await Promise.all([
        fetch("/api/admin/g2bulk-games"),
        fetch("/api/admin/games")
      ]);

      const g2bulkData = await g2bulkRes.json();
      const localData = await localRes.json();

      if (g2bulkData.success) {
        setG2bulkGames(g2bulkData.games);
      }
      
      if (Array.isArray(localData)) {
        setLocalGames(localData);
        // Pre-select games that are already in the DB
        const existingCodes = new Set<string>();
        localData.forEach(game => existingCodes.add(game.id_string));
        setSelectedCodes(existingCodes);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = useMemo(() => {
    if (!search) return g2bulkGames;
    const lower = search.toLowerCase();
    return g2bulkGames.filter(g => g.name.toLowerCase().includes(lower) || g.code.toLowerCase().includes(lower));
  }, [g2bulkGames, search]);

  const handleToggle = (code: string) => {
    const next = new Set(selectedCodes);
    if (next.has(code)) {
      next.delete(code);
    } else {
      next.add(code);
    }
    setSelectedCodes(next);
  };

  const handleSave = async () => {
    const selectedGamesList = g2bulkGames.filter(g => selectedCodes.has(g.code));
    if (selectedGamesList.length === 0) {
      alert("Please select at least one game.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ games: selectedGamesList })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Games saved successfully!");
        fetchData();
      } else {
        alert(data.error || "Failed to save games");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">G2Bulk Games Library</h2>
          <p className="text-gray-400 text-sm">Select games from G2Bulk and add them to your database.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white focus:outline-none focus:border-primary w-full sm:w-64"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors glow-primary whitespace-nowrap disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save to Database"}
          </button>
        </div>
      </div>

      <div className="glass-card border border-white/10 rounded-2xl overflow-hidden p-6">
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading games...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGames.map(game => {
              const isSelected = selectedCodes.has(game.code);
              const isAlreadyInDb = localGames.some(l => l.id_string === game.code);
              
              return (
                <div 
                  key={game.id}
                  onClick={() => handleToggle(game.code)}
                  className={`relative cursor-pointer flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isSelected 
                      ? "border-primary bg-primary/10" 
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
                    {game.image_url && (
                      <img src={game.image_url} alt={game.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{game.name}</h4>
                    <p className="text-xs text-gray-400 truncate">{game.code}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <CheckCircle className="text-primary" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                    )}
                  </div>
                </div>
              );
            })}
            
            {filteredGames.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-8">
                No games found matching "{search}".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
