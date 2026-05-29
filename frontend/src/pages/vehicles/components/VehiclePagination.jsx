import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, fetchVehicles } from '@/redux/slices/vehicleSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function VehiclePagination() {
  const dispatch = useDispatch();
  const { pagination, loading } = useSelector(state => state.vehicle);
  const { page, pages } = pagination;

  if (pages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    dispatch(setPage(newPage));
    dispatch(fetchVehicles());
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const nums = [];
    const maxVisible = 5;
    
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      nums.push(i);
    }
    return nums;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-16 pb-8">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1 || loading}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-border text-primary hover:border-accent hover:text-accent disabled:opacity-50 disabled:hover:border-border disabled:hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map(num => (
        <button
          key={num}
          onClick={() => handlePageChange(num)}
          disabled={loading}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-body-sm font-semibold transition-all duration-300 ${
            page === num 
              ? 'bg-primary text-white shadow-lg scale-110' 
              : 'text-secondary hover:bg-surface border border-transparent hover:border-border'
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === pages || loading}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-border text-primary hover:border-accent hover:text-accent disabled:opacity-50 disabled:hover:border-border disabled:hover:text-primary transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
