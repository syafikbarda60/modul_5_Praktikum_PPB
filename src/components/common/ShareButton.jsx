// src/components/common/ShareButton.jsx
import { useState } from "react";
import { Share2, Copy, Check, Facebook, Twitter, Send, X } from "lucide-react";

export default function ShareButton({ recipe, size = "md" }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  // Generate share URL
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/?recipe=${recipe.id}`;
  };

  const shareUrl = getShareUrl();
  const shareText = `Lihat resep ${recipe.name} di Resep Nusantara!`;

  // Copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Gagal menyalin link");
    }
  };

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Share to Facebook
  const shareToFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  // Share to Twitter
  const shareToTwitter = () => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  // Native Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleNativeShare}
        className={`
          ${sizes[size]} rounded-full flex items-center justify-center
          transition-all duration-200
          bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600
          backdrop-blur-sm shadow-md hover:shadow-lg
          group
        `}
        title="Bagikan resep"
      >
        <Share2
          className={`${iconSizes[size]} transition-transform group-hover:scale-110`}
        />
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                Bagikan Resep
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Recipe Preview */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <img
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 line-clamp-1">
                    {recipe.name}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {recipe.category === "makanan" ? "Makanan" : "Minuman"}
                  </p>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  Bagikan melalui:
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                  >
                    <Send className="w-6 h-6 text-green-600" />
                    <span className="text-xs font-medium text-slate-700">
                      WhatsApp
                    </span>
                  </button>

                  <button
                    onClick={shareToFacebook}
                    className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    <Facebook className="w-6 h-6 text-blue-600" />
                    <span className="text-xs font-medium text-slate-700">
                      Facebook
                    </span>
                  </button>

                  <button
                    onClick={shareToTwitter}
                    className="flex flex-col items-center gap-2 p-4 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors"
                  >
                    <Twitter className="w-6 h-6 text-sky-600" />
                    <span className="text-xs font-medium text-slate-700">
                      Twitter
                    </span>
                  </button>
                </div>
              </div>

              {/* Copy Link */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Atau salin link:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-600"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      copied
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600">
                    Link berhasil disalin!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
