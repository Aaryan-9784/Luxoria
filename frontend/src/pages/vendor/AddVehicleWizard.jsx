import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createVendorVehicle } from '@/redux/slices/vendorSlice';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';

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
  
  // Image Upload State
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  // Step 1 & 2 Submit (Creates Vehicle in DB)
  const onFormSubmit = async (data) => {
    try {
      // Format data
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
          coordinates: [0, 0] // Default, could use Geocoding API later
        },
        features: data.features.split(',').map(f => f.trim()).filter(Boolean)
      };

      const result = await dispatch(createVendorVehicle(vehicleData)).unwrap();
      setCreatedVehicleId(result._id);
      setCurrentStep(3); // Move to image upload
    } catch (err) {
      alert("Failed to create vehicle: " + err);
    }
  };

  // Step 3 Submit (Uploads Images to created vehicle)
  const handleImageUpload = async () => {
    if (selectedImages.length === 0) {
      setUploadError('Please select at least one image.');
      return;
    }

    setIsUploadingImages(true);
    setUploadError('');
    
    try {
      const formData = new FormData();
      selectedImages.forEach(file => {
        formData.append('images', file);
      });

      await api.post(`/vehicles/${createdVehicleId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/vendor/vehicles'); // Success
    } catch (err) {
      setUploadError(err.response?.data?.error?.message || 'Failed to upload images.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files].slice(0, 5)); // Limit to 5
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Wizard Header */}
      <div>
        <h1 className="text-h3 text-primary mb-1">Add New Vehicle</h1>
        <p className="text-secondary">Expand your fleet and reach more luxury clients.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2 bg-surface">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
              currentStep >= step.id ? 'bg-primary text-white shadow-lg' : 'bg-surface border-2 border-border text-muted'
            }`}>
              {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${currentStep >= step.id ? 'text-primary' : 'text-muted'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-border shadow-sm relative overflow-hidden">
        
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <AnimatePresence mode="wait">
            
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-h4 text-primary border-b border-border pb-4 mb-6">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Vehicle Title</label>
                    <input {...register("name", { required: true })} className="input-field" placeholder="e.g. Porsche 911 GT3 RS" />
                  </div>
                  <div>
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Brand</label>
                    <input {...register("brand", { required: true })} className="input-field" placeholder="e.g. Porsche" />
                  </div>
                  <div>
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Model</label>
                    <input {...register("model", { required: true })} className="input-field" placeholder="e.g. 911 GT3 RS" />
                  </div>
                  <div>
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Year</label>
                    <input {...register("year", { required: true })} type="number" className="input-field" placeholder="e.g. 2024" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Description (Cinematic Storytelling)</label>
                    <textarea {...register("description", { required: true })} className="input-field min-h-[120px]" placeholder="Describe the luxury experience..." />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button type="button" onClick={() => setCurrentStep(2)} iconRight={ArrowRight}>Next Step</Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Specs & Pricing */}
            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-h4 text-primary border-b border-border pb-4 mb-6">Specifications & Pricing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Category</label>
                    <select {...register("category", { required: true })} className="input-field">
                      <option value="sports">Sports</option>
                      <option value="luxury">Luxury</option>
                      <option value="suv">SUV</option>
                      <option value="sedan">Sedan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Price Per Day ($)</label>
                    <input {...register("pricePerDay", { required: true })} type="number" className="input-field" placeholder="e.g. 15000" />
                  </div>
                  <div>
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Transmission</label>
                    <select {...register("transmission")} className="input-field">
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Fuel Type</label>
                    <select {...register("fuelType")} className="input-field">
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Seats</label>
                    <input {...register("seats")} type="number" className="input-field" placeholder="4" />
                  </div>
                  <div>
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">City Location</label>
                    <input {...register("city", { required: true })} className="input-field" placeholder="e.g. Mumbai" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-caption font-semibold text-primary uppercase block mb-1.5">Features (Comma Separated)</label>
                    <input {...register("features")} className="input-field" placeholder="e.g. Sunroof, Burmester Audio, Massaging Seats" />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} iconLeft={ArrowLeft}>Back</Button>
                  {/* Submitting step 2 creates the vehicle and moves to step 3 */}
                  <Button type="submit" loading={isSubmitting} iconRight={ArrowRight}>Create Vehicle Profile</Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>

        {/* Step 3: Images (Not part of React Hook Form since it uses a separate API call) */}
        <AnimatePresence>
          {currentStep === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-h4 text-primary border-b border-border pb-4 mb-6">Upload Cinematic Images</h3>
              
              <div className="bg-success/10 text-success p-4 rounded-xl border border-success/20 mb-6 font-medium">
                Vehicle profile created successfully! Now upload up to 5 high-quality images.
              </div>

              {uploadError && <div className="text-error text-sm mb-4">{uploadError}</div>}

              <div className="border-2 border-dashed border-border rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:border-accent hover:bg-accent/5 transition-colors group relative cursor-pointer">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 rounded-full bg-surface group-hover:bg-white flex items-center justify-center shadow-sm mb-4 transition-colors">
                  <UploadCloud className="w-8 h-8 text-accent" />
                </div>
                <h4 className="text-lg font-semibold text-primary mb-2">Drag & Drop Images</h4>
                <p className="text-body-sm text-secondary">or click to browse from your computer (Max 5 images)</p>
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-5 gap-4 mt-6">
                  {selectedImages.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleImageUpload} 
                  loading={isUploadingImages}
                  disabled={selectedImages.length === 0}
                  iconRight={CheckCircle2}
                >
                  Complete Upload
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
