"use client";

import { useState, useEffect } from "react";
import { X, Upload, User } from "lucide-react";

export default function ProfileModal({ isOpen, onClose, userData, onUpdate }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setGender(userData.gender || "");
      setBio(userData.bio || "");
      setPhone(userData.phone || "");

      if (userData.profilePhoto) {
        setPhotoPreview(`${BASE_URL}${userData.profilePhoto}`);
      }
    }
  }, [userData]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const profileRes = await fetch(`${BASE_URL}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          gender,
          bio,
          phone,
        }),
      });

      if (!profileRes.ok) {
        throw new Error("Erro ao atualizar informações do perfil");
      }

      if (profilePhoto) {
        const formData = new FormData();
        formData.append("profilePhoto", profilePhoto);

        const photoRes = await fetch(`${BASE_URL}/profile/upload-photo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!photoRes.ok) {
          throw new Error("Erro ao fazer upload da foto de perfil");
        }
      }

      const updatedProfileRes = await fetch(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!updatedProfileRes.ok) {
        throw new Error("Erro ao buscar perfil atualizado");
      }

      const updatedProfile = await updatedProfileRes.json();
      setSuccess("Perfil atualizado com sucesso!");

      if (onUpdate) {
        onUpdate(updatedProfile);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao atualizar perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-500 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Photo Section */}
        <div className="flex justify-center -mt-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800 flex items-center justify-center">
              {photoPreview ? (
                <img
                  src={photoPreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="profile-photo"
              className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1.5 cursor-pointer hover:bg-purple-700 transition-colors"
            >
              <Upload size={14} className="text-white" />
            </label>
            <input
              type="file"
              id="profile-photo"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-2 rounded mb-4">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Gênero
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Seu telefone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                placeholder="Conte um pouco sobre você"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-500 text-white py-2 rounded-md font-medium hover:from-purple-700 hover:to-violet-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
