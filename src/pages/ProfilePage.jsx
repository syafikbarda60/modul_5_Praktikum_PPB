// // src/pages/ProfilePage.jsx
// import { useState, useEffect, useRef } from "react";
// import {
//   Users,
//   User,
//   Hash,
//   Edit,
//   Save,
//   X,
//   Camera,
//   RefreshCw,
//   Trash2,
//   Heart,
// } from "lucide-react";

// // --- Impor hook favorit dan grid ---
// import { useFavorites } from "../hooks/useFavorites";
// import RecipeGrid from "../components/makanan/RecipeGrid";

// // Kunci untuk localStorage (tidak berubah)
// const STORAGE_KEY = "groupProfileInfo";

// // Data awal sebagai fallback (tidak berubah)
// const initialMembers = [
//   {
//     name: "Syafik Barda",
//     nim: "21120123130051",
//     avatar: null,
//   },
//   { name: "Iqbal Ghifari", nim: "21120123130100", avatar: null },
//   { name: "M. Fadly Evanto Prabowo", nim: "21120123120031", avatar: null },
//   { name: "Essa Bintang Nur Athallah", nim: "21120123130067", avatar: null },
// ];

// // Terima prop onRecipeClick
// export default function ProfilePage({ onRecipeClick }) {
//   const [members, setMembers] = useState(initialMembers);
//   const [isEditing, setIsEditing] = useState(false);
//   const fileInputRefs = useRef([]);

//   // Panggil hook useFavorites
//   const {
//     favorites,
//     loading: favoritesLoading,
//     error: favoritesError,
//   } = useFavorites();

//   // --- SEMUA FUNGSI LOGIC (useEffect, handleInputChange, dll) TETAP SAMA ---

//   // Load data dari localStorage
//   useEffect(() => {
//     const storedMembers = localStorage.getItem(STORAGE_KEY);
//     if (storedMembers) {
//       setMembers(JSON.parse(storedMembers));
//     }
//   }, []);

//   // Handle perubahan input
//   const handleInputChange = (index, field, value) => {
//     const updatedMembers = members.map((member, i) => {
//       if (i === index) {
//         return { ...member, [field]: value };
//       }
//       return member;
//     });
//     setMembers(updatedMembers);
//   };

//   // Handle upload foto
//   const handlePhotoChange = (index, event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       alert("Harap pilih file gambar (jpg, png, webp).");
//       return;
//     }
//     if (file.size > 2 * 1024 * 1024) {
//       alert("Ukuran file terlalu besar, maksimal 2MB.");
//       return;
//     }

//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       handleInputChange(index, "avatar", reader.result);
//     };
//   };

//   // Trigger input file
//   const triggerFileInput = (index) => {
//     if (fileInputRefs.current[index]) {
//       fileInputRefs.current[index].click();
//     }
//   };

//   // Hapus Foto
//   const handleRemovePhoto = (index) => {
//     if (window.confirm("Apakah Anda yakin ingin menghapus foto profil ini?")) {
//       handleInputChange(index, "avatar", null);
//     }
//   };

//   // Reset Semua Profil
//   const handleResetProfiles = () => {
//     if (
//       window.confirm(
//         "PERINGATAN: Ini akan mereset SEMUA data kelompok ke default. Yakin?"
//       )
//     ) {
//       setMembers(initialMembers);
//       localStorage.removeItem(STORAGE_KEY);
//       setIsEditing(false);
//       alert("Semua profil telah di-reset ke data awal.");
//     }
//   };

//   // Simpan perubahan
//   const handleSaveChanges = () => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
//     setIsEditing(false);
//     alert("Profil berhasil disimpan!");
//   };

//   // Batal edit
//   const handleCancelEdit = () => {
//     const storedMembers = localStorage.getItem(STORAGE_KEY);
//     setMembers(storedMembers ? JSON.parse(storedMembers) : initialMembers);
//     setIsEditing(false);
//   };

//   const groupInfo = {
//     groupName: "Kelompok 20 PBB Anjay",
//   };

//   // ===================================================================
//   // PERUBAHAN TAMPILAN (LAYOUT) DIMULAI DARI SINI
//   // ===================================================================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8 pt-16 md:pt-24 pb-20 md:pb-8">
//       {/* 1. Wrapper Utama diubah menjadi layout GRID (1 kolom di HP, 3 kolom di Laptop) */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
//         {/* ================================= */}
//         {/* KOLOM KIRI (PROFIL KELOMPOK) */}
//         {/* ================================= */}
//         <div className="lg:col-span-1">
//           {/* Judul dipindahkan ke dalam kolom ini */}
//           <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
//             Profil Kelompok
//           </h1>
//           <p className="text-slate-600 mb-6">
//             Informasi anggota kelompok praktikum.
//           </p>

//           {/* Card Utama (Glassmorphism) - Kodenya sama, hanya dipindahkan */}
//           <div className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl overflow-hidden">
//             {/* Header Card: Nama Kelompok & Tombol Aksi */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-indigo-100">
//               <div className="flex items-center gap-4">
//                 <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
//                   <Users className="w-6 h-6" />
//                 </div>
//                 <h2 className="text-xl md:text-2xl font-semibold text-blue-900">
//                   {groupInfo.groupName}
//                 </h2>
//               </div>

//               {/* Tombol Aksi (Tidak berubah) */}
//               <div className="flex gap-2 flex-shrink-0">
//                 {isEditing ? (
//                   <>
//                     <button
//                       onClick={handleSaveChanges}
//                       className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg transition-all"
//                       title="Simpan Perubahan"
//                     >
//                       <Save className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={handleCancelEdit}
//                       className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 shadow-lg transition-all"
//                       title="Batal"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={handleResetProfiles}
//                       className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transition-all"
//                       title="Reset Semua Profil"
//                     >
//                       <RefreshCw className="w-5 h-5" />
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg transition-all"
//                     title="Edit Profil"
//                   >
//                     <Edit className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Body Card: Daftar Anggota (Tidak berubah) */}
//             <div className="p-6 md:p-8 space-y-6">
//               {members.map((member, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-4 bg-white/70 border border-white/60 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-white/60 hover:bg-white/90"
//                 >
//                   {/* Avatar/Foto */}
//                   <div className="relative flex-shrink-0">
//                     <img
//                       src={
//                         member.avatar ||
//                         `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                           member.name
//                         )}&background=e0e7ff&color=4338ca`
//                       }
//                       alt={member.name}
//                       className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
//                     />
//                     {isEditing && (
//                       <>
//                         <div className="absolute -bottom-10 flex gap-2">
//                           <button
//                             onClick={() => triggerFileInput(index)}
//                             className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-all"
//                             title="Ganti Foto"
//                           >
//                             <Camera size={14} />
//                           </button>

//                           {member.avatar && (
//                             <button
//                               onClick={() => handleRemovePhoto(index)}
//                               className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-all"
//                               title="Hapus Foto"
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           )}
//                         </div>

//                         <input
//                           type="file"
//                           accept="image/*"
//                           ref={(el) => (fileInputRefs.current[index] = el)}
//                           className="hidden"
//                           onChange={(e) => handlePhotoChange(index, e)}
//                         />
//                       </>
//                     )}
//                   </div>

//                   {/* Informasi Nama dan NIM (Tidak berubah) */}
//                   <div className="flex-grow">
//                     {isEditing ? (
//                       <div className="space-y-1">
//                         <input
//                           type="text"
//                           value={member.name}
//                           onChange={(e) =>
//                             handleInputChange(index, "name", e.target.value)
//                           }
//                           className="w-full font-medium text-slate-800 text-base md:text-lg border-b border-slate-300 focus:border-blue-500 focus:ring-0 outline-none bg-transparent py-1"
//                           placeholder="Nama Anggota"
//                         />
//                         <input
//                           type="text"
//                           value={member.nim}
//                           onChange={(e) =>
//                             handleInputChange(index, "nim", e.target.value)
//                           }
//                           className="w-full text-slate-500 text-sm border-b border-slate-300 focus:border-blue-500 focus:ring-0 outline-none bg-transparent py-1"
//                           placeholder="NIM"
//                         />
//                       </div>
//                     ) : (
//                       <>
//                         <p className="font-medium text-slate-800 text-base md:text-lg">
//                           {member.name}
//                         </p>
//                         <div className="flex items-center text-slate-500 text-sm mt-1">
//                           <Hash size={14} className="mr-1.5 text-slate-400" />
//                           <span>{member.nim}</span>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>{" "}
//         {/* Akhir dari Kolom Kiri */}
//         {/* ================================= */}
//         {/* KOLOM KANAN (RESEP FAVORIT) */}
//         {/* ================================= */}
//         <div className="lg:col-span-2">
//           {/* Judul dipindahkan ke dalam kolom ini */}
//           <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
//             Resep Favorit Saya
//           </h1>
//           <p className="text-slate-600 mb-6">Resep yang telah Anda simpan.</p>

//           {/* Konten Resep Favorit (Tidak berubah) */}
//           {favoritesLoading && (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600">Memuat resep favorit...</p>
//             </div>
//           )}

//           {favoritesError && (
//             <div className="text-center py-12">
//               <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//                 <p className="text-red-600 font-semibold mb-2">
//                   Terjadi Kesalahan
//                 </p>
//                 <p className="text-red-500">{favoritesError}</p>
//               </div>
//             </div>
//           )}

//           {!favoritesLoading && !favoritesError && (
//             <>
//               {favorites.length === 0 ? (
//                 <div className="text-center py-16 flex flex-col items-center bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl">
//                   <Heart
//                     size={48}
//                     className="text-red-300 mb-4"
//                     strokeWidth={1.5}
//                   />
//                   <p className="text-slate-500 text-lg">
//                     Anda belum memiliki resep favorit.
//                   </p>
//                   <p className="text-slate-400 mt-2">
//                     Klik ikon hati pada resep untuk menambahkannya.
//                   </p>
//                 </div>
//               ) : (
//                 // Menggunakan kembali RecipeGrid (Tidak berubah)
//                 <RecipeGrid recipes={favorites} onRecipeClick={onRecipeClick} />
//               )}
//             </>
//           )}
//         </div>{" "}
//         {/* Akhir dari Kolom Kanan */}
//       </div>{" "}
//       {/* Akhir dari Wrapper Grid Utama */}
//     </div>
//   );
// }

// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import {
  Camera,
  Edit2,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  ChefHat,
  Award,
} from "lucide-react";
import userService from "../services/userService";

export default function ProfilePage({ onRecipeClick }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalReviews: 0,
    totalFavorites: 0,
  });

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const loadProfile = () => {
    const userProfile = userService.getUserProfile();
    setProfile(userProfile);
    setEditForm({
      username: userProfile.username || "",
      email: userProfile.email || "",
      phone: userProfile.phone || "",
      location: userProfile.location || "",
      bio: userProfile.bio || "",
    });
    setAvatarPreview(userProfile.avatar);
  };

  const loadStats = () => {
    // Load favorites count
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    // Load user recipes (if stored locally)
    const userRecipes = JSON.parse(
      localStorage.getItem("user_recipes") || "[]"
    );

    setStats({
      totalRecipes: userRecipes.length,
      totalReviews: 0, // Could be calculated from API
      totalFavorites: favorites.length,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    const updatedProfile = {
      ...editForm,
      avatar: avatarPreview,
      updatedAt: new Date().toISOString(),
    };

    const result = userService.saveUserProfile(updatedProfile);

    if (result.success) {
      setProfile(result.data);
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } else {
      alert("Gagal memperbarui profil: " + result.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadProfile();
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-32 md:h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 md:-mt-20 mb-4">
              <div className="relative inline-block">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500">
                      <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                    <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nama Pengguna
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={editForm.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan nama"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="08xx-xxxx-xxxx"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Lokasi
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={editForm.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Kota, Provinsi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={editForm.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Ceritakan tentang diri Anda..."
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                      {profile.username}
                    </h1>

                    <div className="space-y-2 text-slate-600">
                      {profile.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{profile.email}</span>
                        </div>
                      )}

                      {profile.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                      )}

                      {profile.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{profile.location}</span>
                        </div>
                      )}

                      {profile.updatedAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            Bergabung{" "}
                            {new Date(profile.updatedAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {profile.bio && (
                      <p className="mt-4 text-slate-700 leading-relaxed">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Simpan
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Batal
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-white/40 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">
              {stats.totalRecipes}
            </p>
            <p className="text-sm text-slate-600 mt-1">Resep</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-white/40 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">
              {stats.totalFavorites}
            </p>
            <p className="text-sm text-slate-600 mt-1">Favorit</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-white/40 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">
              {stats.totalReviews}
            </p>
            <p className="text-sm text-slate-600 mt-1">Ulasan</p>
          </div>
        </div>

        {/* User ID Info */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/40">
          <p className="text-xs text-slate-500">
            ID Pengguna: <span className="font-mono">{profile.userId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
