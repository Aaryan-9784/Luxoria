import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCompare, clearCompare } from '@/redux/slices/vehicleSlice';
import { X, Trash2, Star, Zap, Gauge, Settings, Users, Fuel, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EASE_LUXE } from '@/lib/motion';

function CompareRow({ label, icon: Icon, values }) {
  return (
    <tr className="border-b border-border/30 last:border-0">
      <td className="py-3 px-4 text-xs font-bold text-primary uppercase tracking-wider bg-surface/50 w-[120px]">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}
          {label}
        </div>
      </td>
      {values.map((val, i) => (
        <td key={i} className="py-3 px-4 text-sm text-primary text-center capitalize font-medium">
          {val || '—'}
        </td>
      ))}
      {/* Fill empty cells */}
      {Array.from({ length: 3 - values.length }).map((_, i) => (
        <td key={`empty-${i}`} className="py-3 px-4 text-center text-muted text-sm">—</td>
      ))}
    </tr>
  );
}

export default function CompareVehicles() {
  const dispatch = useDispatch();
  const compareList = useSelector(state => state.vehicle.compareList);
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (compareList.length === 0) return null;

  const getVal = (v, key) => {
    if (key === 'rating') {
      return typeof v.rating === 'object' ? `${v.rating.average} ★` : v.rating ? `${v.rating} ★` : '—';
    }
    return v[key];
  };

  return (
    <>
      {/* Floating Compare Bar */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[90] bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.1)]"
        >
          <div className="container-luxe py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Compare Vehicles Thumbnails */}
                <div className="flex items-center gap-3">
                  {compareList.map((v) => (
                    <div key={v.id} className="relative group">
                      <div className="w-16 h-12 rounded-xl overflow-hidden border-2 border-border shadow-sm">
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCompare(v.id))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="text-[9px] text-center text-secondary font-medium mt-1 block truncate max-w-[64px]">
                        {v.name}
                      </span>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <div key={`slot-${i}`} className="w-16 h-12 rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center">
                      <span className="text-[9px] text-muted">+ Add</span>
                    </div>
                  ))}
                </div>

                <div className="hidden sm:block">
                  <span className="text-sm font-bold text-primary">{compareList.length}/3</span>
                  <span className="text-xs text-muted ml-1">vehicles selected</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => dispatch(clearCompare())}
                  className="btn btn-ghost btn-sm text-muted hover:text-error"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
                <button
                  onClick={() => setIsExpanded(true)}
                  disabled={compareList.length < 2}
                  className="btn btn-accent btn-sm rounded-full px-6 disabled:opacity-50"
                >
                  Compare Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Full Compare Modal */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: EASE_LUXE } }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-4xl max-h-[85vh] bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div>
                  <h2 className="text-h3 text-primary">Compare Vehicles</h2>
                  <p className="text-body-sm text-secondary mt-1">Side-by-side comparison of your selected vehicles</p>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="btn-icon"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-auto flex-1 p-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="p-4 w-[120px]"></th>
                      {compareList.map((v) => (
                        <th key={v.id} className="p-4 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden shadow-md">
                              <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="text-accent text-[10px] font-bold tracking-[0.15em] uppercase block">
                                {v.brand}
                              </span>
                              <span className="text-sm font-bold text-primary">{v.name}</span>
                            </div>
                            <button
                              onClick={() => dispatch(removeFromCompare(v.id))}
                              className="text-[10px] text-muted hover:text-error transition-colors font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </th>
                      ))}
                      {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                        <th key={`empty-${i}`} className="p-4 text-center">
                          <div className="w-full aspect-[3/2] rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center">
                            <span className="text-xs text-muted">Empty Slot</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <CompareRow label="Price/Day" icon={Star} values={compareList.map(v => `$${v.pricePerDay?.toLocaleString()}`)} />
                    <CompareRow label="Horsepower" icon={Zap} values={compareList.map(v => v.horsepower)} />
                    <CompareRow label="Top Speed" icon={Gauge} values={compareList.map(v => v.topSpeed)} />
                    <CompareRow label="Engine" icon={Settings} values={compareList.map(v => v.engine)} />
                    <CompareRow label="Transmission" icon={Settings} values={compareList.map(v => v.transmission)} />
                    <CompareRow label="Seats" icon={Users} values={compareList.map(v => String(v.seats))} />
                    <CompareRow label="Fuel" icon={Fuel} values={compareList.map(v => v.fuelType)} />
                    <CompareRow label="Rating" icon={Star} values={compareList.map(v => getVal(v, 'rating'))} />
                    <CompareRow label="Location" icon={MapPin} values={compareList.map(v => v.location)} />
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-border/50 bg-surface/30">
                <button onClick={() => dispatch(clearCompare())} className="btn btn-ghost btn-sm text-muted">
                  <Trash2 className="w-4 h-4" /> Clear All
                </button>
                <div className="flex gap-3">
                  {compareList.map(v => (
                    <Link
                      key={v.id}
                      to={`/vehicles/${v.id}`}
                      onClick={() => setIsExpanded(false)}
                      className="btn btn-primary btn-sm rounded-full px-4"
                    >
                      Book {v.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
