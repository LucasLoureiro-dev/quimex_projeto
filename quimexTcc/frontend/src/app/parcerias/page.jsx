"use client";

import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import {
  Mail,
  Building,
  PhoneCall,
  UploadCloud,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

// --- Funções utilitárias ---
const clean = (value) => value.replace(/\D/g, "");

const formatCNPJ = (value) => {
  const cleaned = clean(value).substring(0, 14);
  const parts = [];

  if (cleaned.length > 0) parts.push(cleaned.substring(0, 2));
  if (cleaned.length > 2) parts.push(cleaned.substring(2, 5));
  if (cleaned.length > 5) parts.push(cleaned.substring(5, 8));
  if (cleaned.length > 8) parts.push(cleaned.substring(8, 12));
  if (cleaned.length > 12) parts.push(cleaned.substring(12, 14));

  let masked =
    parts.slice(0, 3).join(".") +
    (parts.length > 3 ? `/${parts[3]}` : "");

  if (parts.length > 4) masked += `-${parts[4]}`;

  return masked.slice(0, 18);
};

const formatPhone = (value) => {
  const cleaned = clean(value).substring(0, 11);

  if (cleaned.length <= 2) return cleaned.length ? `(${cleaned}` : "";

  const ddd = cleaned.substring(0, 2);
  let rest = cleaned.substring(2);

  let prefixLength = cleaned.length <= 10 ? 4 : 5;
  let suffixLength = 4;

  const prefix = rest.substring(0, prefixLength);
  const suffix = rest.substring(prefixLength, prefixLength + suffixLength);

  let masked = `(${ddd}) ${prefix}`;
  if (rest.length > prefixLength) masked += `-${suffix}`;

  return masked.trim();
};

// --- Estado inicial ---
const initialFormData = {
  companyName: "",
  cnpj: "",
  email: "",
  phone: "",
  segment: "",
  logoFile: null,
  logoPreview: "",
};

export default function PartnerRegistration() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const segments = useMemo(
    () => [
      "Agroindústria",
      "Indústria e Transformação",
      "Farmacêutica e Cosmética",
      "Limpeza e Saneamento",
      "Outros (Especifique na mensagem)",
    ],
    []
  );

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let maskedValue = value;
    if (name === "cnpj") maskedValue = formatCNPJ(value);
    if (name === "phone") maskedValue = formatPhone(value);

    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
  };

  // Upload de imagem
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logoFile: file,
          logoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Selecione um arquivo PNG ou JPG válido.");
      setFormData((prev) => ({ ...prev, logoFile: null, logoPreview: "" }));
    }
  };

  // SUBMIT FINAL
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedCNPJ = clean(formData.cnpj);
    const cleanedPhone = clean(formData.phone);

    if (cleanedCNPJ.length !== 14 || (cleanedPhone.length !== 10 && cleanedPhone.length !== 11)) {
      setSubmissionStatus("error");
      setTimeout(() => setSubmissionStatus(null), 5000);
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const fd = new FormData();
      fd.append("companyName", formData.companyName);
      fd.append("cnpj", formData.cnpj);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("segment", formData.segment);
      fd.append("logoFile", formData.logoFile);

      const response = await fetch("/api/parcerias", {
        method: "POST",
        body: fd,
      });

      if (!response.ok) throw new Error("Falha no envio");

      setSubmissionStatus("success");
      setFormData(initialFormData);

      // Redireciona em 5 segundos
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } catch (error) {
      console.error("Erro:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Classes de estilo
  const containerClasses =
    "min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6";

  const cardClasses =
    "bg-white shadow-xl rounded-2xl w-full max-w-4xl p-6 sm:p-10 border border-gray-200";

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150";

  const labelClasses =
    "block text-sm font-medium text-gray-700 mb-1 mt-3";

  const buttonPrimaryClasses =
    "w-full flex items-center justify-center py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:opacity-50";

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-primary transition p-2 rounded-full mr-2"
          >
            <ArrowLeft size={24} />
          </button>

          <h1 className="text-3xl font-bold text-gray-800">
            Junte-se a Nós: Cadastro de Parceria
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Preencha o formulário abaixo para iniciar sua jornada como parceiro Quimex.
        </p>

        {/* ALERTAS */}
        {submissionStatus === "success" && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4">
            <CheckCircle className="inline mr-2" />
            Cadastro enviado! Você será redirecionado em 5 segundos.
          </div>
        )}

        {submissionStatus === "error" && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4">
            Erro ao enviar. Verifique os dados e tente novamente.
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Empresa */}
            <div>
              <label className={labelClasses}>Nome da Empresa</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Quimex Soluções Industriais"
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>

            {/* CNPJ */}
            <div>
              <label className={labelClasses}>CNPJ</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                required
                maxLength={18}
                placeholder="00.000.000/0001-00"
                className={inputClasses}
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClasses}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="contato@empresa.com.br"
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label className={labelClasses}>Telefone</label>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  maxLength={15}
                  placeholder="(11) 99999-9999"
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}>Segmento de Atuação</label>
              <select
                name="segment"
                required
                value={formData.segment}
                onChange={handleInputChange}
                className={`${inputClasses} cursor-pointer`}
              >
                <option value="">Selecione...</option>
                {segments.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* UPLOAD */}
          <div className="mt-6 border border-dashed border-gray-400 p-6 rounded-lg">
            <label className={labelClasses}>Logo da Empresa</label>
            <div className="flex items-center gap-6">
              <label
                htmlFor="logoFile"
                className="cursor-pointer border rounded-lg px-4 py-3 flex items-center gap-2 hover:bg-secondary/10"
              >
                <UploadCloud />
                {formData.logoFile ? formData.logoFile.name : "Selecione o arquivo"}
              </label>

              <input
                type="file"
                id="logoFile"
                name="logoFile"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-24 h-24 bg-gray-100 border flex justify-center items-center rounded-lg overflow-hidden">
                {formData.logoPreview ? (
                  <img
                    src={formData.logoPreview}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-xs text-gray-500">Prévia</span>
                )}
              </div>
            </div>
          </div>

          {/* BOTÃO */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={buttonPrimaryClasses}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Enviando...
                </>
              ) : (
                "Cadastrar Parceria"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
