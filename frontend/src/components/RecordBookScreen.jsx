import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Syringe, 
  Sprout, 
  Heart, 
  AlertTriangle, 
  Volume2, 
  X, 
  Check,
  CloudSync
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { addCropCycle, addLivestockEntry, getCropCycles } from '../utils/api';

export default function RecordBookScreen({ 
  records, 
  setRecords, 
  lang, 
  onSpeakText 
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [filter, setFilter] = useState('all'); // 'all' | 'crop' | 'cattle'
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // New Record Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('crop');
  const [newType, setNewType] = useState('spray'); // 'spray' | 'vaccine' | 'disease' | 'treatment'
  const [newNotes, setNewNotes] = useState('');

  // Fetch initial crop cycles from backend Supabase table on load
  useEffect(() => {
    async function loadBackendCropCycles() {
      try {
        setIsSyncing(true);
        const cycles = await getCropCycles('farm_01');
        if (Array.isArray(cycles) && cycles.length > 0) {
          const remoteRecords = cycles.map(c => ({
            id: c.crop_id || `crop-${Date.now()}`,
            date: c.sowing_date || new Date().toLocaleDateString('en-GB'),
            category: 'crop',
            type: 'spray',
            title: c.crop_name ? `${c.crop_name} (${c.season})` : 'Crop Record',
            titleHi: c.crop_name ? `${c.crop_name} (${c.season})` : 'फसल रिकॉर्ड',
            diseaseName: `Sown: ${c.sowing_date} • Expected Harvest: ${c.expected_harvest_date}`,
            status: c.safe_for_fodder ? 'Healthy' : 'Active',
            severity: 'healthy',
            description: `Pesticide applied: ${c.pesticide_applied ? 'Yes' : 'No'} | Safe fodder: ${c.safe_for_fodder ? 'Yes' : 'No'}`,
            icon: 'sprout'
          }));

          // Merge without duplicate IDs
          setRecords(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueRemote = remoteRecords.filter(r => !existingIds.has(r.id));
            return [...uniqueRemote, ...prev];
          });
        }
      } catch (err) {
        console.warn('[RecordBookScreen] Backend sync notice:', err);
      } finally {
        setIsSyncing(false);
      }
    }
    loadBackendCropCycles();
  }, []);

  // Filtered records
  const filteredRecords = records.filter(r => {
    if (filter === 'all') return true;
    return r.category === filter;
  });

  const handleReadSummary = () => {
    const count = records.length;
    const speech = `${t.records.title}. ${t.records.subtitle}. ${count} ${t.records.all}.`;
    onSpeakText(speech);
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEntry = {
      id: `rec-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: newCategory,
      type: newType,
      title: newTitle,
      titleHi: newTitle,
      diseaseName: newType === 'vaccine' ? 'Vaccination' : 'Treatment/Care',
      status: 'Active',
      severity: newType === 'disease' ? 'caution' : 'healthy',
      description: newNotes.trim() || (lang === 'hi' ? 'खेत रिकॉर्ड में दर्ज किया गया।' : 'Recorded in farm health log.'),
      icon: newType === 'vaccine' ? 'syringe' : newType === 'spray' ? 'sprout' : 'heart'
    };

    // Save locally
    setRecords([newEntry, ...records]);

    // Send to Backend APIs (Crop / Livestock endpoints)
    try {
      if (newCategory === 'crop') {
        await addCropCycle({
          farmer_id: 'farm_01',
          season: 'Current Season',
          crop_name: newTitle,
          sowing_date: new Date().toISOString().split('T')[0],
          expected_harvest_date: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
          pesticide_applied: newType === 'spray' ? 1 : 0,
          safe_for_fodder: 1
        });
      } else {
        await addLivestockEntry({
          farmer_id: 'farm_01',
          animal_tag: 'CATTLE-01',
          species: 'Cattle/Livestock',
          vaccination_name: newTitle,
          last_vaccination_date: new Date().toISOString().split('T')[0],
          next_due_date: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]
        });
      }
    } catch (err) {
      console.warn('[RecordBookScreen] Saved locally, remote backend call skipped:', err);
    }

    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const getRecordIcon = (iconName, type) => {
    if (type === 'vaccine' || iconName === 'syringe') {
      return <Syringe className="w-5 h-5 text-purple-600" />;
    }
    if (type === 'spray' || iconName === 'sprout') {
      return <Sprout className="w-5 h-5 text-emerald-600" />;
    }
    if (type === 'disease' || iconName === 'alert-triangle') {
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    }
    return <Heart className="w-5 h-5 text-rose-600" />;
  };

  return (
    <div className="space-y-4 pb-28 relative">
      
      {/* 1. HEADER & AUDIO GUIDANCE */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-[#193319] tracking-tight">
              {t.records.title}
            </h2>
            {isSyncing && (
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1 border border-emerald-300">
                <CloudSync className="w-3 h-3 animate-spin" />
                Synced
              </span>
            )}
          </div>
          <p className="text-xs text-[#627362] font-medium">
            {t.records.subtitle}
          </p>
        </div>

        <button 
          onClick={handleReadSummary}
          className="p-2 bg-[#ece4d6] hover:bg-[#e0d6c4] text-[#1b5e20] rounded-full transition-colors"
          title="Read log summary"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* 2. CATEGORY FILTER CHIPS */}
      <div className="flex space-x-2">
        {[
          { id: 'all', label: t.records.all, icon: '📋' },
          { id: 'crop', label: t.records.crops, icon: '🌱' },
          { id: 'cattle', label: t.records.cattle, icon: '🐄' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
              filter === item.id
                ? 'bg-[#1b5e20] text-white border-[#1b5e20] shadow-sm'
                : 'bg-white text-[#4d5d4d] border-[#e2d8c8] hover:bg-[#faf7f2]'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 3. VERTICAL TIMELINE LIST OF ENTRIES */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#ded5c4]">
        
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#e5dcce]">
            <span className="text-4xl">📖</span>
            <p className="text-sm font-bold text-[#3d4d3d] mt-2">
              {t.records.empty}
            </p>
            <p className="text-xs text-[#7d8c7d] mt-1">
              {lang === 'hi' ? 'नया टीका या छिड़काव दर्ज करने के लिए + दबाएं।' : 'Tap the floating + button to add an entry.'}
            </p>
          </div>
        ) : (
          filteredRecords.map((item, index) => {
            const isUrgent = item.severity === 'urgent';
            const isCaution = item.severity === 'caution';

            return (
              <div key={item.id || index} className="relative group">
                
                {/* Timeline node marker */}
                <div className={`absolute -left-6 top-4 w-5 h-5 rounded-full border-4 border-[#f5f1e8] flex items-center justify-center ${
                  isUrgent ? 'bg-red-500' : isCaution ? 'bg-amber-500' : 'bg-emerald-600'
                }`} />

                {/* Entry Card */}
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#e6dcce] hover:shadow-md transition-shadow">
                  
                  {/* Top line: Date and Status Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#718271]">
                      <Calendar className="w-3.5 h-3.5 text-[#1b5e20]" />
                      <span>{item.date}</span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      item.status === 'Completed' || item.status === 'Recovered' || item.status === 'Healthy'
                        ? 'bg-[#e8f5e9] text-[#1b5e20] border-[#c8e6c9]'
                        : item.status === 'Treated'
                        ? 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb]'
                        : 'bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Body: Icon + Title + 1-line description */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#faf7f2] border border-[#ede3d4] flex items-center justify-center shrink-0 mt-0.5">
                      {getRecordIcon(item.icon, item.type)}
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-extrabold text-[#1a2f1a] leading-tight">
                        {lang === 'hi' ? item.titleHi : item.title}
                      </h4>
                      <p className="text-xs text-[#526152] font-medium mt-1 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        )}

      </div>

      {/* 4. FLOATING "+" BUTTON */}
      <div className="fixed bottom-20 right-5 z-40 max-w-md">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 rounded-full bg-[#1b5e20] hover:bg-[#144718] text-white shadow-xl shadow-green-900/30 flex items-center justify-center active:scale-90 transition-all border-2 border-emerald-300"
          aria-label="Add new record"
          title="Add new farm entry"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* 5. ADD NEW RECORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-[#e5dcce] max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#eee7da] mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📝</span>
                <h3 className="text-base font-extrabold text-[#183118]">
                  {t.records.addRecordModal}
                </h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#f0e9dc] hover:bg-[#e4dcce] flex items-center justify-center text-[#334233]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4">
              
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-bold text-[#495949] mb-1.5">
                  {lang === 'hi' ? 'श्रेणी चुनें' : 'Select Category'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCategory('crop')}
                    className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all ${
                      newCategory === 'crop'
                        ? 'bg-[#1b5e20] text-white border-[#1b5e20]'
                        : 'bg-[#faf8f2] text-[#4d5c4d] border-[#ded5c2]'
                    }`}
                  >
                    <Sprout className="w-4 h-4" />
                    <span>{t.records.crops}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory('cattle')}
                    className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all ${
                      newCategory === 'cattle'
                        ? 'bg-[#b45309] text-white border-[#b45309]'
                        : 'bg-[#faf8f2] text-[#4d5c4d] border-[#ded5c2]'
                    }`}
                  >
                    <span>🐄</span>
                    <span>{t.records.cattle}</span>
                  </button>
                </div>
              </div>

              {/* Action Type Picker */}
              <div>
                <label className="block text-xs font-bold text-[#495949] mb-1.5">
                  {t.records.type}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'spray', label: lang === 'hi' ? 'छिड़काव' : 'Spray', icon: '🌱' },
                    { id: 'vaccine', label: lang === 'hi' ? 'टीका' : 'Vaccine', icon: '💉' },
                    { id: 'disease', label: lang === 'hi' ? 'बीमारी' : 'Disease', icon: '⚠️' },
                    { id: 'treatment', label: lang === 'hi' ? 'उपचार' : 'Care', icon: '❤️' }
                  ].map(tItem => (
                    <button
                      key={tItem.id}
                      type="button"
                      onClick={() => setNewType(tItem.id)}
                      className={`p-2 rounded-2xl text-center border transition-all ${
                        newType === tItem.id
                          ? 'bg-[#1b5e20] text-white border-[#1b5e20]'
                          : 'bg-[#faf8f2] text-[#445244] border-[#ded5c2]'
                      }`}
                    >
                      <span className="text-lg block">{tItem.icon}</span>
                      <span className="text-[10px] font-bold block mt-0.5">{tItem.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-[#495949] mb-1">
                  {lang === 'hi' ? 'कार्य / दवा का नाम' : 'Action / Medicine Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'hi' ? 'उदा. नीम तेल छिड़काव / FMD टीका' : 'e.g. Neem Spray on Rice / FMD Vaccine'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-2xl bg-[#faf8f2] border border-[#d8cebe] text-sm text-[#1b2f1b] focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              {/* Short Note */}
              <div>
                <label className="block text-xs font-bold text-[#495949] mb-1">
                  {t.records.notes}
                </label>
                <textarea
                  rows={2}
                  placeholder={lang === 'hi' ? 'खेत या पशु की स्थिति का विवरण' : 'Brief notes (e.g. sprayed in evening on 2 acres)'}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf8f2] border border-[#d8cebe] text-sm text-[#1b2f1b] focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#1b5e20] hover:bg-[#144718] text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2 active:scale-98 transition-transform"
              >
                <Check className="w-4 h-4" />
                <span>{t.records.saveBtn}</span>
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
