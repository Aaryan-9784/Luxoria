import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateVehicleImages } from '@/redux/slices/vendorSlice';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import {
  CheckCircle2, ArrowRight, ArrowLeft, X,
  Link as LinkIcon, Car, Settings2, ImagePlus,
  AlertCircle, Loader2, Sparkles,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';

const STEPS = [
  { id: 1, label: 'Basic Info',    icon: Car,       desc: 'Name, brand & story'    },
  { id: 2, label: 'Specs & Price', icon: Settings2, desc: 'Category, specs & rate'  },
  { id: 3, label: 'Images',        icon: ImagePlus, desc: 'Gallery URLs'            },
];

const FieldLabel = ({ children, required }) => (
  <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-[0.15em] mb-2">
    {children}
    {required && <span className="text-[#DC2626] ml-0.5">*</span>}
  </label>
);

const FieldError = ({ message }) =>
  message ? (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#DC2626]">
      <AlertCircle className="w-3 h-3 shrink-0" /> {message}
    </p>
  ) : null;

const inputCls = (hasError) =>
  `w-full bg-[#F9FAFB] border ${
    hasError ? 'border-[#DC2626] ring-1 ring-[#DC2626]/20' : 'border-[#E5E7EB]'
  } text-[#0F0F0F] text-[13px] py-3 px-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 transition-all placeholder:text-[#C0C0C0] font-medium`;

export default function EditVehicleWizard() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { id }     = useParams();
  const { accessToken } = useSelector((state) => state.auth);

  const [step, setStep]             = useState(1);
  const [isLoading, setIsLoading]   = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [images, setImages]         = useState([]);
  const [urlInput, setUrlInput]     = useState('');
  const [imageError, setImageError] = useState('');
  const [uploading, setUploading]   = useState(false);

  const {
    register, handleSubmit, control, trigger, reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { category: 'sports', transmission: 'automatic', fuelType: 'petrol', seats: '4' },
  });

  // ── Load vehicle ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!accessToken) return;
    const load = async () => {
      try {
        const res = await api.get(`/vehicles/${id}`);
        const v   = res.data.data.vehicle;
        reset({
          name:         v.name         ?? '',
          brand:        v.brand        ?? '',
          model:        v.model        ?? '',
          year:         v.year         ?? '',
          category:     v.category     ?? 'sports',
          transmission: v.transmission ?? 'automatic',
          fuelType:     v.fuelType     ?? 'petrol',
          seats:        String(v.seats ?? '4'),
          pricePerDay:  v.pricePerDay  ?? '',
          description:  v.description  ?? '',
          city:         v.location?.city  ?? '',
          state:        v.location?.state ?? '',
          features:     v.features?.join(', ') ?? '',
        });
        setImages((v.images ?? []).map((img) => img.url));
      } catch {
        navigate('/vendor/vehicles');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, accessToken, reset, navigate]);

  // ── Step 2 → 1 (back, no data loss) ─────────────────────────────────────
  const goToStep1 = () => setStep(1);

  const goToStep2 = async () => {
    const ok = await trigger(['name', 'brand', 'year', 'description']);
    if (ok) setStep(2);
  };

  const onFormSubmit = async (data) => {
    setSubmitError('');
    try {
      const payload = {
        name:         data.name.trim(),
        brand:        data.brand.trim(),
        model:        data.model?.trim()       || undefined,
        year:         data.year  ? parseInt(data.year, 10)   : undefined,
        category:     data.category     || 'sports',
        transmission: data.transmission || 'automatic',
        fuelType:     data.fuelType     || 'petrol',
        seats:        parseInt(data.seats, 10) || 4,
        pricePerDay:  parseFloat(data.pricePerDay),
        description:  data.description?.trim() || undefined,
        location: {
          city:  data.city?.trim()  || undefined,
          state: data.state?.trim() || undefined,
        },
        features: data.features
          ? data.features.split(',').map((f) => f.trim()).filter(Boolean)
          : [],
      };
      await api.put(`/vehicles/${id}`, payload);
      setStep(3);
    } catch (err) {
      setSubmitError(err.response?.data?.error?.message || 'Failed to update vehicle.');
    }
  };

  const addImageUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith('http')) { setImageError('Please enter a valid URL (must start with http).'); return; }
    setImages((prev) => [...prev, url]);
    setUrlInput('');
    setImageError('');
  };

  const handleFinalUpload = async () => {
    if (images.length === 0) { setImageError('Add at least one image URL.'); return; }
    setUploading(true);
    setImageError('');
    try {
      const imagesPayload = images.map((url, idx) => ({
        url,
        publicId: `url-${Date.now()}-${idx}`,
      }));
      await dispatch(updateVehicleImages({ id, images: imagesPayload })).unwrap();
      navigate('/vendor/vehicles');
    } catch (err) {
      setImageError(typeof err === 'string' ? err : 'Failed to save images.');
    } finally {
      setUploading(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#666666] font-bold uppercase tracking-widest text-[11px] animate-pulse">Loading Vehicle…</p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8 pb-12">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div variants={staggerItem} className="mb-2">
        <h1
          className="text-[28px] font-bold text-[#0F0F0F] tracking-tight mb-1.5"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Edit Vehicle
        </h1>
        <p className="text-[#666666] text-sm font-medium tracking-wide">
          Update your vehicle details, pricing, and gallery.
        </p>
      </motion.div>

      {/* ── Step cards ─────────────────────────────────────────────────── */}
      <motion.div variants={staggerItem} className="grid grid-cols-3 gap-4">
        {STEPS.map((s) => {
          const Icon   = s.icon;
          const done   = step > s.id;
          const active = step === s.id;
          return (
            <div
              key={s.id}
              className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300
                ${active ? 'bg-[#0F0F0F] border-[#0F0F0F] shadow-xl'
                : done   ? 'bg-white border-[#16A34A]/30'
                :           'bg-white border-[#ECECEC]'}`}
            >
              {active && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C9A75D] to-transparent" />
              )}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${active ? 'bg-[#C9A75D]/20 text-[#C9A75D]'
                  : done   ? 'bg-[#16A34A]/10 text-[#16A34A]'
                  :           'bg-[#F5F5F5] text-[#9CA3AF]'}`}>
                  {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest
                  ${active ? 'text-[#C9A75D]' : done ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>
                  {done ? 'Done' : `0${s.id}`}
                </span>
              </div>
              <p className={`text-[13px] font-bold tracking-tight mb-0.5
                ${active ? 'text-white' : done ? 'text-[#0F0F0F]' : 'text-[#9CA3AF]'}`}>
                {s.label}
              </p>
              <p className={`text-[11px] font-medium ${active ? 'text-white/50' : 'text-[#BBBBBB]'}`}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </motion.div>

      {/* ── Form card ──────────────────────────────────────────────────── */}
      <motion.div
        variants={staggerItem}
        className="relative overflow-hidden bg-white border border-[#ECECEC] rounded-2xl shadow-sm"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent" />

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <AnimatePresence mode="wait">

            {/* ── Step 1 ────────────────────────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -32 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                className="p-8 space-y-8"
              >
                <SectionHeading icon={Car} label="Basic Information" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="md:col-span-2">
                    <FieldLabel required>Vehicle Title</FieldLabel>
                    <input
                      {...register('name', { required: 'Vehicle title is required' })}
                      className={inputCls(errors.name)}
                      placeholder="e.g. Rolls-Royce Phantom VIII"
                    />
                    <FieldError message={errors.name?.message} />
                  </div>

                  <div>
                    <FieldLabel required>Brand</FieldLabel>
                    <input
                      {...register('brand', { required: 'Brand is required' })}
                      className={inputCls(errors.brand)}
                      placeholder="e.g. Rolls-Royce"
                    />
                    <FieldError message={errors.brand?.message} />
                  </div>

                  <div>
                    <FieldLabel>Model</FieldLabel>
                    <input {...register('model')} className={inputCls(false)} placeholder="e.g. Phantom VIII" />
                  </div>

                  <div>
                    <FieldLabel>Year</FieldLabel>
                    <input
                      {...register('year', {
                        min: { value: 1990, message: 'Year must be 1990 or later' },
                        max: { value: new Date().getFullYear() + 1, message: 'Invalid year' },
                      })}
                      type="number"
                      className={inputCls(errors.year)}
                      placeholder={`e.g. ${new Date().getFullYear()}`}
                    />
                    <FieldError message={errors.year?.message} />
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel>
                      Description
                      <span className="ml-2 normal-case font-normal text-[#9CA3AF] tracking-normal">
                        — cinematic storytelling
                      </span>
                    </FieldLabel>
                    <textarea
                      {...register('description', {
                        maxLength: { value: 2000, message: 'Max 2000 characters' },
                      })}
                      rows={4}
                      className={`${inputCls(errors.description)} resize-y`}
                      placeholder="Describe the luxury experience this vehicle delivers…"
                    />
                    <FieldError message={errors.description?.message} />
                  </div>

                </div>

                <FormFooter>
                  <div />
                  <GoldButton type="button" onClick={goToStep2}>
                    Specifications <ArrowRight className="w-4 h-4" />
                  </GoldButton>
                </FormFooter>
              </motion.div>
            )}

            {/* ── Step 2 ────────────────────────────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -32 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                className="p-8 space-y-8"
              >
                <SectionHeading icon={Settings2} label="Specifications & Pricing" />

                {submitError && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-[#DC2626]/5 border border-[#DC2626]/20">
                    <AlertCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                    <p className="text-[12px] font-semibold text-[#DC2626]">{submitError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <FieldLabel required>Category</FieldLabel>
                    <Controller
                      name="category" control={control} rules={{ required: true }}
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value} onChange={field.onChange} icon={null}
                          options={[
                            { value: 'sedan',       label: 'Sedan'       },
                            { value: 'suv',         label: 'SUV'         },
                            { value: 'sports',      label: 'Sports'      },
                            { value: 'luxury',      label: 'Luxury'      },
                            { value: 'convertible', label: 'Convertible' },
                            { value: 'limousine',   label: 'Limousine'   },
                            { value: 'electric',    label: 'Electric'    },
                          ]}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Price Per Day (₹)</FieldLabel>
                    <input
                      {...register('pricePerDay', {
                        required: 'Price is required',
                        min: { value: 1, message: 'Price must be positive' },
                      })}
                      type="number"
                      className={inputCls(errors.pricePerDay)}
                      placeholder="e.g. 15000"
                    />
                    <FieldError message={errors.pricePerDay?.message} />
                  </div>

                  <div>
                    <FieldLabel>Transmission</FieldLabel>
                    <Controller
                      name="transmission" control={control}
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value} onChange={field.onChange} icon={null}
                          options={[
                            { value: 'automatic', label: 'Automatic' },
                            { value: 'manual',    label: 'Manual'    },
                          ]}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <FieldLabel>Fuel Type</FieldLabel>
                    <Controller
                      name="fuelType" control={control}
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value} onChange={field.onChange} icon={null}
                          options={[
                            { value: 'petrol',   label: 'Petrol'   },
                            { value: 'diesel',   label: 'Diesel'   },
                            { value: 'electric', label: 'Electric' },
                            { value: 'hybrid',   label: 'Hybrid'   },
                          ]}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <FieldLabel>Seats</FieldLabel>
                    <input
                      {...register('seats', {
                        min: { value: 1,  message: 'Min 1 seat'   },
                        max: { value: 20, message: 'Max 20 seats' },
                      })}
                      type="number"
                      className={inputCls(errors.seats)}
                      placeholder="4"
                    />
                    <FieldError message={errors.seats?.message} />
                  </div>

                  <div>
                    <FieldLabel required>City</FieldLabel>
                    <input
                      {...register('city', { required: 'City is required' })}
                      className={inputCls(errors.city)}
                      placeholder="e.g. Mumbai"
                    />
                    <FieldError message={errors.city?.message} />
                  </div>

                  <div>
                    <FieldLabel>State</FieldLabel>
                    <input {...register('state')} className={inputCls(false)} placeholder="e.g. Maharashtra" />
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel>
                      Features
                      <span className="ml-2 normal-case font-normal text-[#9CA3AF] tracking-normal">
                        (comma-separated)
                      </span>
                    </FieldLabel>
                    <input
                      {...register('features')}
                      className={inputCls(false)}
                      placeholder="e.g. Sunroof, Massaging Seats, Burmester Audio, 360° Camera"
                    />
                  </div>

                </div>

                <FormFooter>
                  <GhostButton type="button" onClick={goToStep1}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </GhostButton>
                  <GoldButton type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                      : <>Save Changes <ArrowRight className="w-4 h-4" /></>
                    }
                  </GoldButton>
                </FormFooter>
              </motion.div>
            )}

          </AnimatePresence>
        </form>

        {/* ── Step 3: Images ────────────────────────────────────────────── */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="p-8 space-y-8"
            >
              <SectionHeading icon={ImagePlus} label="Vehicle Images" />

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#16A34A]/8 border border-[#16A34A]/20">
                <div className="w-10 h-10 rounded-full bg-[#16A34A]/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#0F0F0F]">Vehicle details saved successfully</p>
                  <p className="text-[11px] text-[#666666] font-medium mt-0.5">Manage up to 5 image URLs below.</p>
                </div>
              </div>

              {imageError && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#DC2626]/5 border border-[#DC2626]/20">
                  <AlertCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                  <p className="text-[12px] font-semibold text-[#DC2626]">{imageError}</p>
                </div>
              )}

              <div>
                <FieldLabel>Image URL</FieldLabel>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                    <input
                      type="url" value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                      placeholder="https://example.com/car-photo.jpg"
                      className={`${inputCls(false)} pl-11`}
                    />
                  </div>
                  <button
                    type="button" onClick={addImageUrl}
                    disabled={!urlInput}
                    className="shrink-0 px-5 py-3 border border-[#ECECEC] rounded-xl text-[11px] font-bold uppercase tracking-wider text-[#0F0F0F] hover:bg-[#F5F5F5] hover:border-[#C9A75D]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Add
                  </button>
                </div>
                {images.length > 0 && (
                  <p className="text-[11px] text-[#9CA3AF] font-medium mt-2">
                    {images.length} image{images.length !== 1 ? 's' : ''} added
                  </p>
                )}
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#ECECEC] bg-[#F9FAFB] group shadow-sm">
                      <img
                        src={url} alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/95 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-white"
                      >
                        <X className="w-3.5 h-3.5 text-[#DC2626]" />
                      </button>
                      <div className="absolute bottom-1.5 left-1.5 bg-black/55 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <FormFooter>
                <div />
                <GoldButton onClick={handleFinalUpload} disabled={images.length === 0 || uploading}>
                  {uploading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    : <><Sparkles className="w-4 h-4" /> Save & Finish</>
                  }
                </GoldButton>
              </FormFooter>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

    </motion.div>
  );
}

// ── Shared micro-components ───────────────────────────────────────────────────

function SectionHeading({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#ECECEC] pb-5">
      <div className="w-8 h-8 rounded-full bg-[#0F0F0F] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#C9A75D]" />
      </div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F]">{label}</h3>
    </div>
  );
}

function FormFooter({ children }) {
  return (
    <div className="flex items-center justify-between pt-6 mt-2 border-t border-[#ECECEC]">
      {children}
    </div>
  );
}

function GoldButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center gap-2 px-7 py-3 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${props.className ?? ''}`}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="flex items-center gap-2 px-6 py-3 border border-[#ECECEC] rounded-xl text-[11px] font-bold uppercase tracking-wider text-[#666666] hover:bg-[#F5F5F5] hover:border-[#C9A75D]/30 transition-all"
    >
      {children}
    </button>
  );
}
