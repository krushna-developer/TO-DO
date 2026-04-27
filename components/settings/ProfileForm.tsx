"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import { useProfileStore, type Profile } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";

type FormState  = Omit<Profile, "avatarUrl">;
type FormErrors = Partial<Record<keyof FormState, string>>;

const FIELDS: {
  id:          keyof FormState;
  label:       string;
  placeholder: string;
  type?:       string;
  colSpan?:    boolean;
  textarea?:   boolean;
}[] = [
  { id: "name",     label: "Username",  placeholder: "e.g. janedoe"               },
  { id: "fullName", label: "Full Name", placeholder: "e.g. Jane Doe"              },
  { id: "email",    label: "Email",     placeholder: "you@example.com", type: "email" },
  { id: "phone",    label: "Phone",     placeholder: "+91 00000 00000", type: "tel"   },
  { id: "address",  label: "Address",   placeholder: "Street / Area",  colSpan: true  },
  { id: "city",     label: "City",      placeholder: "e.g. Mumbai"                },
  { id: "pincode",  label: "Pincode",   placeholder: "e.g. 431001"                },
  { id: "bio",      label: "Bio",       placeholder: "Tell us about yourself…",
    colSpan: true, textarea: true },
];

const FIELD_STYLE = `
  bg-white dark:bg-[#0f1a2e]
  border-slate-200 dark:border-white/[0.07]
  text-slate-900 dark:text-white
  placeholder:text-slate-400 dark:placeholder:text-slate-600
  focus-visible:ring-1 focus-visible:ring-sky-500
  focus-visible:border-sky-500/50
  h-10 transition-all duration-200
`;

export default function ProfileForm() {
  const { profile, updateProfile, setIsSaved, isSaved } = useProfileStore();
  const { user } = useAuthStore();

  const buildForm = (): FormState => ({
    name:     profile.name     || user?.name  || "",
    fullName: profile.fullName || "",
    email:    profile.email    || user?.email || "",
    phone:    profile.phone    || "",
    address:  profile.address  || "",
    city:     profile.city     || "",
    pincode:  profile.pincode  || "",
    bio:      profile.bio      || "",
  });

  const [form,   setForm]   = useState<FormState>(buildForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [dirty,  setDirty]  = useState(false);

  // sync on mount
  useEffect(() => { setForm(buildForm()); }, []);

  // auto-hide saved toast
  useEffect(() => {
    if (!isSaved) return;
    const t = setTimeout(() => setIsSaved(false), 3000);
    return () => clearTimeout(t);
  }, [isSaved, setIsSaved]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((p) => ({ ...p, [id]: value }));
    setErrors((p) => ({ ...p, [id]: "" }));
    setIsSaved(false);
    setDirty(true);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim())     errs.name     = "Username is required";
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim())    errs.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (form.phone && !/^\+?[\d\s\-]{7,15}$/.test(form.phone))
      errs.phone = "Enter a valid phone number";
    if (form.pincode && !/^\d{4,10}$/.test(form.pincode))
      errs.pincode = "Enter a valid pincode";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateProfile(form);
    setIsSaved(true);
    setDirty(false);
  };

  const handleReset = () => {
    setForm(buildForm());
    setErrors({});
    setDirty(false);
    setIsSaved(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <div
            key={field.id}
            className={field.colSpan ? "sm:col-span-2" : "col-span-1"}
          >
            <Label
              htmlFor={field.id}
              className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5 block"
            >
              {field.label}
              {["name", "fullName", "email"].includes(field.id) && (
                <span className="text-red-400 ml-0.5">*</span>
              )}
            </Label>

            {field.textarea ? (
              <Textarea
                id={field.id}
                value={form[field.id]}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={3}
                className={`${FIELD_STYLE} h-auto resize-none`}
              />
            ) : (
              <Input
                id={field.id}
                type={field.type ?? "text"}
                value={form[field.id]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`${FIELD_STYLE} ${
                  errors[field.id]
                    ? "border-red-500 dark:border-red-500/70 focus-visible:ring-red-500"
                    : ""
                }`}
              />
            )}

            {errors[field.id] && (
              <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors[field.id]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer row */}
      <div className="flex items-center gap-3 pt-1 border-t border-slate-100 dark:border-white/5">
        <Button
          onClick={handleSave}
          className="bg-sky-500 hover:bg-sky-400 text-white px-6 h-10 font-semibold transition-colors duration-200"
        >
          Save Changes
        </Button>

        {dirty && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="gap-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 h-10 px-3"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        )}

        {isSaved && (
          <span className="flex items-center gap-1.5 text-green-500 dark:text-green-400 text-sm ml-auto animate-in fade-in slide-in-from-right-2 duration-300">
            <CheckCircle2 className="w-4 h-4" />
            Profile saved!
          </span>
        )}
      </div>
    </div>
  );
}
