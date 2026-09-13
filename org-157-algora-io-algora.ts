import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Bounty } from '@/types/bounty';

interface BountyRangeFilterProps {
  bounties: Bounty[];
  onFilterChange?: (filteredBounties: Bounty[]) => void;
}

export const BountyRangeFilter: React.FC<BountyRangeFilterProps> = ({ bounties, onFilterChange }) => {
  const router = useRouter();
  const [minBounty, setMinBounty] = useState<number>(0);
  const [maxBounty, setMaxBounty] = useState<number>(10000);

  // Initialize filter values from URL query params on mount
  useEffect(() => {
    const { min, max } = router.query;
    if (min) setMinBounty(Number(min));
    if (max) setMaxBounty(Number(max));
  }, [router.query]);

  // Update URL and filter bounties when values change
  useEffect(() => {
    const newQuery = { ...router.query };
    
    if (minBounty > 0) {
      newQuery.min = minBounty.toString();
    } else {
      delete newQuery.min;
    }

    if (maxBounty < 10000) {
      newQuery.max = maxBounty.toString();
    } else {
      delete newQuery.max;
    }

    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });

    if (onFilterChange) {
      const filtered = bounties.filter(b => Number(b.reward) >= minBounty && Number(b.reward) <= maxBounty);
      onFilterChange(filtered);
    }
  }, [minBounty, maxBounty]);

  return (
    <div className="bounty-range-filter flex gap-4 my-4">
      <label className="flex items-center gap-2">
        <span>Min Reward:</span>
        <input
          type="number"
          value={minBounty}
          onChange={(e) => setMinBounty(Number(e.target.value))}
          className="border p-1 rounded w-24"
          min={0}
        />
      </label>
      <label className="flex items-center gap-2">
        <span>Max Reward:</span>
        <input
          type="number"
          value={maxBounty}
          onChange={(e) => setMaxBounty(Number(e.target.value))}
          className="border p-1 rounded w-24"
          min={0}
        />
      </label>
    </div>
  );
};