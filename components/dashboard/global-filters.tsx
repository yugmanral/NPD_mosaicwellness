'use client'

import React from 'react'
import { useData } from '@/context/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { X, CalendarIcon, Filter, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'

export function GlobalFilters() {
  const { filters, updateFilter, clearFilters, uniqueValues, isLoading } = useData()

  const hasActiveFilters =
    filters.competitor_brand.length > 0 ||
    filters.competitor_category.length > 0 ||
    filters.platform.length > 0 ||
    filters.rating_bin.length > 0 ||
    filters.verified_purchase.length > 0 ||
    filters.date_range[0] !== null ||
    filters.date_range[1] !== null

  const activeFilterCount = [
    filters.competitor_brand.length > 0,
    filters.competitor_category.length > 0,
    filters.platform.length > 0,
    filters.rating_bin.length > 0,
    filters.verified_purchase.length > 0,
    filters.date_range[0] !== null || filters.date_range[1] !== null,
  ].filter(Boolean).length

  if (isLoading || !uniqueValues) {
    return (
      <div className="sticky top-16 z-20 border-b border-border bg-card/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading filters...</span>
        </div>
      </div>
    )
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    updateFilter('date_range', [range?.from ?? null, range?.to ?? null])
  }

  return (
    <div className="sticky top-16 z-20 border-b border-border bg-card/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 rounded-full px-2 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Brand Filter */}
        <MultiSelectFilter
          label="Brand"
          options={uniqueValues.brands}
          selected={filters.competitor_brand}
          onChange={(value) => updateFilter('competitor_brand', value)}
        />

        {/* Category Filter */}
        <MultiSelectFilter
          label="Category"
          options={uniqueValues.categories}
          selected={filters.competitor_category}
          onChange={(value) => updateFilter('competitor_category', value)}
        />

        {/* Platform Filter */}
        <MultiSelectFilter
          label="Platform"
          options={uniqueValues.platforms}
          selected={filters.platform}
          onChange={(value) => updateFilter('platform', value)}
        />

        {/* Rating Bin Filter */}
        <MultiSelectFilter
          label="Rating"
          options={['Low', 'Moderate', 'High']}
          selected={filters.rating_bin}
          onChange={(value) => updateFilter('rating_bin', value)}
          optionLabels={{
            Low: 'Low (<1.5)',
            Moderate: 'Moderate (1.5-3.5)',
            High: 'High (>3.5)',
          }}
        />

        {/* Verified Purchase Filter */}
        <MultiSelectFilter
          label="Verified"
          options={['Yes', 'No']}
          selected={filters.verified_purchase}
          onChange={(value) => updateFilter('verified_purchase', value)}
        />

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-8 gap-2 text-xs',
                (filters.date_range[0] || filters.date_range[1]) && 'border-primary'
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              {filters.date_range[0] || filters.date_range[1] ? (
                <>
                  {filters.date_range[0] && format(filters.date_range[0], 'MMM d')}
                  {' - '}
                  {filters.date_range[1] && format(filters.date_range[1], 'MMM d')}
                </>
              ) : (
                'Date Range'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: filters.date_range[0] ?? undefined,
                to: filters.date_range[1] ?? undefined,
              }}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              defaultMonth={uniqueValues.dateRange[0]}
            />
          </PopoverContent>
        </Popover>

        {/* Clear All */}
        {hasActiveFilters && (
          <>
            <div className="h-6 w-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              Clear All
            </Button>
          </>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.competitor_brand.map((brand) => (
            <FilterTag
              key={`brand-${brand}`}
              label={brand}
              onRemove={() =>
                updateFilter(
                  'competitor_brand',
                  filters.competitor_brand.filter((b) => b !== brand)
                )
              }
            />
          ))}
          {filters.competitor_category.map((category) => (
            <FilterTag
              key={`category-${category}`}
              label={category}
              onRemove={() =>
                updateFilter(
                  'competitor_category',
                  filters.competitor_category.filter((c) => c !== category)
                )
              }
            />
          ))}
          {filters.platform.map((platform) => (
            <FilterTag
              key={`platform-${platform}`}
              label={platform}
              onRemove={() =>
                updateFilter(
                  'platform',
                  filters.platform.filter((p) => p !== platform)
                )
              }
            />
          ))}
          {filters.rating_bin.map((bin) => (
            <FilterTag
              key={`rating-${bin}`}
              label={`Rating: ${bin}`}
              onRemove={() =>
                updateFilter(
                  'rating_bin',
                  filters.rating_bin.filter((b) => b !== bin)
                )
              }
            />
          ))}
          {filters.verified_purchase.map((verified) => (
            <FilterTag
              key={`verified-${verified}`}
              label={`Verified: ${verified}`}
              onRemove={() =>
                updateFilter(
                  'verified_purchase',
                  filters.verified_purchase.filter((v) => v !== verified)
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface MultiSelectFilterProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (value: string[]) => void
  optionLabels?: Record<string, string>
}

function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
  optionLabels,
}: MultiSelectFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-8 gap-2 text-xs', selected.length > 0 && 'border-primary')}
        >
          {label}
          {selected.length > 0 && (
            <Badge variant="secondary" className="h-4 rounded-full px-1.5 text-[10px]">
              {selected.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={selected.includes(option)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...selected, option])
                  } else {
                    onChange(selected.filter((s) => s !== option))
                  }
                }}
              />
              <Label
                htmlFor={option}
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                {optionLabels?.[option] ?? option}
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface FilterTagProps {
  label: string
  onRemove: () => void
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <Badge
      variant="secondary"
      className="h-6 gap-1 pl-2 pr-1 text-xs font-normal"
    >
      {label}
      <button
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}
