import React, { useState } from 'react';
import { useFarmerStore } from '../../../hooks/useFarmerStore';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../../../i18n';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Sprout, 
  Globe, 
  Lock, 
  HelpCircle, 
  Camera, 
  Edit3, 
  Check, 
  Building2,
  FileText
} from 'lucide-react';

interface ProfileViewProps {
  currentLang: LanguageCode;
  onSelectLang: (l: LanguageCode) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentLang, onSelectLang }) => {
  const { profile, updateProfile } = useFarmerStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [mobile, setMobile] = useState(profile.mobile);
  const [village, setVillage] = useState(profile.village);
  const [district, setDistrict] = useState(profile.district);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      mobile,
      village,
      district
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 select-none font-sans">
      {/* 1. Profile Header Card */}
      <div className="bg-[#203864] text-white rounded-[8px] p-5 shadow-sm border-b-4 border-[#F47920] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#F47920] shadow"
            />
            <button
              onClick={() => alert('Photo updated with verified camera scan.')}
              className="absolute bottom-0 right-0 w-6 h-6 bg-[#F47920] text-white rounded-full flex items-center justify-center border-2 border-white shadow hover:bg-[#e06b18]"
              title="Update profile photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">{profile.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#228B22] text-white flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED
              </span>
            </div>
            <div className="text-xs text-slate-200 mt-1 flex items-center gap-2">
              <span>Member ID: {profile.id}</span>
              <span>•</span>
              <span>Since {profile.memberSince}</span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {profile.village}, {profile.district}, {profile.state}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold rounded border border-white/20 flex items-center gap-1.5 self-start sm:self-auto transition-all"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#F47920]" />
          <span>{isEditing ? 'CLOSE EDIT' : 'EDIT PROFILE'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 text-[#228B22] rounded text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile changes updated successfully.</span>
        </div>
      )}

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 space-y-3 text-xs shadow-sm animate-fadeIn">
          <div className="font-bold text-sm text-[#05224D] border-b border-[#E7ECF2] pb-2">
            Update Personal Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Farmer Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-[#C4C6D0] rounded text-xs"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Number (For SMS)</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-2 border border-[#C4C6D0] rounded text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Village</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-2 border border-[#C4C6D0] rounded text-xs"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">District / Region</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 border border-[#C4C6D0] rounded text-xs"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#E7ECF2]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="btn-press px-4 py-1.5 bg-[#203864] hover:bg-[#172033] text-white font-bold rounded text-xs shadow"
            >
              SAVE CHANGES
            </button>
          </div>
        </form>
      )}

      {/* 2. Verification & KYC Status Breakdown (92% Score) */}
      <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7ECF2] pb-3">
          <div>
            <div className="text-[10px] font-mono text-[#228B22] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#228B22]" />
              <span>GOVERNMENT APMC VERIFICATION CRITERIA</span>
            </div>
            <h3 className="text-lg font-bold text-[#05224D] tracking-tight">
              Profile Readiness & KYC Verification: {profile.verificationScore}%
            </h3>
          </div>

          <div className="px-3 py-1 bg-green-50 border border-green-200 text-[#228B22] rounded text-xs font-mono font-bold">
            ELIGIBLE FOR MSP DBT
          </div>
        </div>

        {/* 4 Cards: Personal, Identity, Farm, Bank */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Card 1: Identity & Aadhaar Virtual ID */}
          <div className="p-3.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded-[6px] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#203864]" />
                <strong className="font-bold text-[#05224D]">Masked Identity & VID</strong>
              </div>
              <span className="text-[10px] font-mono text-[#228B22] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            </div>
            <div className="font-mono text-xs text-slate-700">
              Virtual ID: <strong>{profile.virtualId}</strong>
            </div>
            <div className="font-mono text-xs text-slate-700">
              Aadhaar Ref: <strong>{profile.maskedAadhaar}</strong>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
              Your raw 12-digit Aadhaar number is never stored or exposed to Mandi staff.
            </p>
          </div>

          {/* Card 2: Land Records */}
          <div className="p-3.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded-[6px] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#228B22]" />
                <strong className="font-bold text-[#05224D]">Farm Land Ownership</strong>
              </div>
              <span className="text-[10px] font-mono text-[#228B22] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            </div>
            <div className="font-mono text-xs text-slate-700">
              Khasra: <strong>{profile.farmDetails.khasraNumber}</strong>
            </div>
            <div className="font-mono text-xs text-slate-700">
              Holding: <strong>{profile.farmDetails.totalLandHectares} Ha ({profile.farmDetails.cultivatedAreaHectares} Ha cultivated)</strong>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
              Synchronized with MP Bhulekh digital revenue land records registry.
            </p>
          </div>

          {/* Card 3: Bank DBT Linking */}
          <div className="p-3.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded-[6px] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#203864]" />
                <strong className="font-bold text-[#05224D]">Aadhaar-Linked Bank (DBT)</strong>
              </div>
              <span className="text-[10px] font-mono text-[#228B22] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ACTIVE
              </span>
            </div>
            <div className="font-mono text-xs text-slate-700">
              Bank: <strong>{profile.bankDetails.bankName}</strong>
            </div>
            <div className="font-mono text-xs text-slate-700">
              Account: <strong>{profile.bankDetails.accountMasked} (IFSC: {profile.bankDetails.ifsc})</strong>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
              Direct Benefit Transfer activated. MSP proceeds deposit directly here.
            </p>
          </div>

          {/* Card 4: Soil Health & Crop Insurance */}
          <div className="p-3.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded-[6px] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#228B22]" />
                <strong className="font-bold text-[#05224D]">Soil Health & Advisory</strong>
              </div>
              <span className="text-[10px] font-mono text-[#228B22] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VALID
              </span>
            </div>
            <div className="font-mono text-xs text-slate-700">
              Card No: <strong>{profile.farmDetails.soilHealthCardNo}</strong>
            </div>
            <div className="font-mono text-xs text-slate-700">
              Irrigation: <strong>{profile.farmDetails.irrigationType}</strong>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
              Soil nitrogen and organic carbon levels certified for Rabi 2026.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Language Selection Section */}
      <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-[#E7ECF2] pb-2">
          <Globe className="w-4 h-4 text-[#203864]" />
          <h3 className="font-bold text-sm text-[#05224D]">
            PREFERRED APPLICATION LANGUAGE
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => onSelectLang(l.code)}
              className={`p-2.5 rounded-[6px] border text-center transition-all ${
                currentLang === l.code
                  ? 'border-[#203864] bg-[#203864] text-white font-bold shadow-sm'
                  : 'border-[#C4C6D0] hover:border-slate-400 bg-white text-slate-700'
              }`}
            >
              <div className="text-xs font-bold">{l.native}</div>
              <div className={`text-[10px] ${currentLang === l.code ? 'text-slate-200' : 'text-slate-500'}`}>
                {l.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Support & Multi-Channel Rural Assistance (Section 52) */}
      <div className="bg-[#FFF9F0] border border-[#FFE4BA] rounded-[8px] p-4 sm:p-5 text-xs space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#D97706]" />
          <h3 className="font-bold text-sm text-[#172033]">
            RURAL MULTI-CHANNEL ASSISTANCE & HELPLINES
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-white border border-[#FFE4BA] rounded">
            <div className="font-bold text-[#05224D] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#228B22]" />
              <span>Toll-Free Kisan Call Centre</span>
            </div>
            <div className="font-mono text-sm text-[#228B22] font-extrabold mt-1">
              1800-200-5196
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Available 24/7 in Hindi, Marathi, Punjabi, Odia & English
            </div>
          </div>

          <div className="p-3 bg-white border border-[#FFE4BA] rounded">
            <div className="font-bold text-[#05224D] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#F47920]" />
              <span>SMS Booking Gateway</span>
            </div>
            <div className="font-mono text-sm text-[#05224D] font-extrabold mt-1">
              SMS "CG BOOK" to 51969
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Works on standard feature phones without internet
            </div>
          </div>

          <div className="p-3 bg-white border border-[#FFE4BA] rounded">
            <div className="font-bold text-[#05224D] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#203864]" />
              <span>Common Service Centre (CSC)</span>
            </div>
            <div className="font-mono text-xs text-[#05224D] font-bold mt-1">
              Bilkisganj Village Kiosk
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Visit VLE Operator Manoj Sharma for free assisted token printing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
