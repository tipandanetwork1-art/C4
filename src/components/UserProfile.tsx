"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Upload, Save, Mail, KeyRound, Check, X } from "lucide-react";

import { auth } from "@lib/firebase";

export function UserProfile() {
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser);
  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setDisplayName(user?.displayName ?? "");
      setEmail(user?.email ?? "");
      setPhotoURL(user?.photoURL ?? "");
    });
    return () => unsubscribe();
  }, []);

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-slate-600">Faça login novamente para personalizar o seu perfil.</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setStatus("saving");
    setErrorMessage(null);

    try {
      if (
        currentUser.displayName !== displayName ||
        currentUser.photoURL !== photoURL
      ) {
        await updateProfile(currentUser, {
          displayName,
          photoURL: photoURL || null,
        });
      }

      if (email && currentUser.email !== email) {
        await updateEmail(currentUser, email);
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar seu perfil."
      );
    }
  };

  const handleReset = async () => {
    if (!currentUser.email) return;
    setResetStatus("loading");
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      setResetStatus("success");
      setTimeout(() => setResetStatus("idle"), 2000);
    } catch (error) {
      console.error(error);
      setResetStatus("error");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-6">
          {photoURL ? (
            <img
              src={photoURL}
              alt={displayName || "Foto do perfil"}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center text-2xl font-semibold">
              {(displayName || email)[0]?.toUpperCase() ?? "?"}
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div>
              <label className="text-sm text-slate-500">Nome completo</label>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Foto do perfil</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="url"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://"
                  value={photoURL}
                  onChange={(event) => setPhotoURL(event.target.value)}
                />
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 text-slate-600 hover:bg-slate-50"
                  onClick={() => setPhotoURL("")}
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Informações de contato</h2>
        <div>
          <label className="text-sm text-slate-500">Email</label>
          <div className="mt-1 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="inline-flex items-center rounded-lg border border-slate-200 px-3 text-xs text-slate-500">
              <Mail size={14} className="mr-1" />
              Verificado
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={status === "saving"}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Save size={16} />
            {status === "saving" ? "Salvando..." : "Salvar alterações"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={resetStatus === "loading"}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <KeyRound size={16} />
            Enviar redefinição de senha
          </button>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 flex items-center gap-2">
            <X size={14} />
            {errorMessage}
          </p>
        )}
        {status === "success" && (
          <p className="text-sm text-emerald-600 flex items-center gap-2">
            <Check size={14} />
            Perfil atualizado com sucesso.
          </p>
        )}
        {resetStatus === "success" && (
          <p className="text-sm text-emerald-600 flex items-center gap-2">
            <Check size={14} />
            Email de redefinição enviado para {email}.
          </p>
        )}
        {resetStatus === "error" && (
          <p className="text-sm text-red-600 flex items-center gap-2">
            <X size={14} />
            Não foi possível enviar o email de redefinição.
          </p>
        )}
      </div>
    </div>
  );
}
