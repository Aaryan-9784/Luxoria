import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createVendorVehicle } from '@/redux/slices/vendorSlice';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ArrowLeft, X, Link as LinkIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

const STEPS = [
  { id: 1, title: 'Basic Information' },
  { id: 2, title: 'Specifications & Pricing' },
  { id: 3, title: 'Images Upload' }
];

export default function AddVehicleWizard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdVehicleId, setCreatedVehicleId] = useState(null);
  
  // Image URL State
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  // Step 1 & 2 Submit (Creates Vehicle in DB)
  const onFormSubmit = async (data) => {
    try {
      const vehicleData = {
        name: data.name,
        brand: data.brand,
        model: data.model,
        year: parseInt(data.year),
        category: data.category,
        transmission: data.transmission,
        fuelType: data.fuelType,
        seats: parseInt(data.seats),
        pricePerDay: parseInt(data.pricePerDay),
        description: data.description,
        location: {
          city: data.city,
          state: data.state,
          coordinates: [0, 0]
        },
        features: data.features.split(',').map(f => f.trim()).filter(Boolean)
      };

      const result = await dispatch(createVendorVehicle(vehicleData)).unwrap();
      setCreatedVehicleId(result._id);
      setCurrentStep(3);
    } catch (err) {
      alert("Failed to create vehicle: " + err);
    }
  };

  // Step 3 Submit (Updates vehicle with image URLs)
  const handleImageUpload = async () => {
    if (selectedImages.length === 0) {
      setUploadError('Please add at least one image URL.');
      return;
    }

    setIsUploadingImages(true);
    setUploadError('');
    
    try {
      const imagesPayload = selectedImages.map((url, idx) => ({
        url: url,
        publicId: `external-url-${Date.now()}-${idx}`
      }));

      await api.put(`/vehicles/${createdVehicleId}`, { images: imagesPayload });
      navigate('/vendor/vehicles');
    } catch (err) {
      setUploadError(err.response?.data?.error?.message || 'Failed to save images.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleAddUrl = () => {
    if (currentUrl && selectedImages.length < 5) {
      setSelectedImages(prev => [...prev, currentUrl]);
      setCurrentUrl('');
      setUploadError('');
    } else if (selectedImages.length >= 5) {
      setUploadError('Maximum 5 images allowed.');
    }
  };

  const inputClasses = "w-full bg-[#F5F5F5]/50 border border-[#ECECEC] text-[#0F0F0F] text-[13px] py-3.5 px-4 rounded-xl focus:outline-none focus:border-[#C9A75D] focus:ring-1 focus:ring-[#C9A75D]/30 transition-all placeholder:text-[#9CA3AF]";
  const labelClasses = "block text-[10px] font-bold text-[#666666] uppercase tracking-[0.15em] mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Wizard Header */}
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-[#0F0F0F] tracking-tight mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Add New Vehicle</h1>
        <p className="text-[#666666] text-[13px] font-medium tracking-wide">Expand your fleet and reach more luxury clients.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between relative mb-12 max-w-2xl mx-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#ECECEC] -z-10" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#C9A75D] -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-3 bg-[#F8FAFC]">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              currentStep >= step.id 
                ? 'bg-[#0F0F0F] text-[#C9A75D] shadow-[0_0_15px_rgba(201,167,93,0.3)] ring-4 ring-white' 
                : 'bg-white border-2 border-[#ECECEC] text-[#9CA3AF] ring-4 ring-[#F8FAFC]'
            }`}>
              {currentStep > step.id ? <CheckCircle2 className="w-5 h-5 text-[#C9A75D]" /> : step.id}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${currentStep >= step.id ? 'text-[#0F0F0F]' : 'text-[#9CA3AF]'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm p-8 md:p-12 relative overflow-hidden">
        
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <AnimatePresence mode="wait">
            
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] border-b border-[#ECECEC] pb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClasses}>Vehicle Title</label>
                    <input {...register("name", { required: true })} className={inputClasses} placeholder="e.g. Porsche 911 GT3 RS" />
                  </div>
                  <div>
                    <label className={labelClasses}>Brand</label>
                    <input {...register("brand", { required: true })} className={inputClasses} placeholder="e.g. Porsche" />
                  </div>
                  <div>
                    <label className={labelClasses}>Model</label>
                    <input {...register("model", { required: true })} className={inputClasses} placeholder="e.g. 911 GT3 RS" />
                  </div>
                  <div>
                    <label className={labelClasses}>Year</label>
                    <input {...register("year", { required: true })} type="number" className={inputClasses} placeholder="e.g. 2024" />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Description (Cinematic Storytelling)</label>
                    <textarea {...register("description", { required: true })} className={`${inputClasses} min-h-[140px] resize-y`} placeholder="Describe the luxury experience..." />
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(2)} 
                    className="flex items-center gap-2 px-8 py-3.5 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg transition-all"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Specs & Pricing */}
            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] border-b border-[#ECECEC] pb-4">Specifications & Pricing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClasses}>Category</label>
                    <select {...register("category", { required: true })} className={inputClasses}>
                      <option value="sports">Sports</option>
                      <option value="luxury">Luxury</option>
                      <option value="suv">SUV</option>
                      <option value="sedan">Sedan</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Price Per Day ($)</label>
                    <input {...register("pricePerDay", { required: true })} type="number" className={inputClasses} placeholder="e.g. 15000" />
                  </div>
                  <div>
                    <label className={labelClasses}>Transmission</label>
                    <select {...register("transmission")} className={inputClasses}>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Fuel Type</label>
                    <select {...register("fuelType")} className={inputClasses}>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Seats</label>
                    <input {...register("seats")} type="number" className={inputClasses} placeholder="4" />
                  </div>
                  <div>
                    <label className={labelClasses}>City Location</label>
                    <input {...register("city", { required: true })} className={inputClasses} placeholder="e.g. Mumbai" />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Features (Comma Separated)</label>
                    <input {...register("features")} className={inputClasses} placeholder="e.g. Sunroof, Burmester Audio, Massaging Seats" />
                  </div>
                </div>

                <div className="flex justify-between pt-8 border-t border-[#ECECEC]">
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(1)} 
                    className="flex items-center gap-2 px-6 py-3.5 bg-white border border-[#ECECEC] text-[#0F0F0F] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#C9A75D] to-[#B59345] text-[#0F0F0F] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(201,167,93,0.4)] disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? 'Processing...' : 'Create Vehicle Profile'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>

        {/* Step 3: Images */}
        <AnimatePresence>
          {currentStep === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0F0F0F] border-b border-[#ECECEC] pb-4">Add Vehicle Images (URLs)</h3>
              
              <div className="bg-[#16A34A]/10 text-[#16A34A] p-5 rounded-xl border border-[#16A34A]/20 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-[13px] font-bold">Vehicle profile created successfully! Now add up to 5 image URLs.</p>
              </div>

              {uploadError && <div className="text-[#DC2626] text-[13px] font-medium p-4 bg-[#DC2626]/10 rounded-xl">{uploadError}</div>}

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon className="w-4 h-4 text-[#9CA3AF]" />
                  </div>
                  <input 
                    type="url" 
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                    placeholder="https://example.com/car-image.jpg"
                    className={`${inputClasses} pl-10`}
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleAddUrl}
                  disabled={!currentUrl || selectedImages.length >= 5}
                  className="px-8 py-3.5 bg-white border border-[#ECECEC] text-[#0F0F0F] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#F5F5F5] disabled:opacity-50 transition-all whitespace-nowrap"
                >
                  Add Image URL
                </button>
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {selectedImages.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#ECECEC] shadow-sm group bg-[#F5F5F5]">
                      <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button 
                        type="button"
                        onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 bg-white/90 text-[#DC2626] p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-8 border-t border-[#ECECEC]">
                <button 
                  onClick={handleImageUpload} 
                  disabled={selectedImages.length === 0 || isUploadingImages}
                  className="flex items-center gap-2 px-8 py-3.5 bg-[#0F0F0F] text-[#C9A75D] text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isUploadingImages ? 'Saving...' : 'Complete Upload'} <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
