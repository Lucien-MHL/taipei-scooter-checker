import { create } from 'zustand'
import { Station, Metadata } from '@/types/station'

type StationsStore = {
  metadata: Metadata | null
  stations: Station[] | null
  isLoading: boolean
  message: string | null
  isFetchFail: boolean
  selectedStation: Station | null
  setLoading: (
    isLoading: boolean,
    options?: { isFetchFail: boolean; message: string }
  ) => void
  setData: (data: { metadata: Metadata; stations: Station[] }) => void
  setSelectedStation: (station: Station) => void
}

export const useStations = create<StationsStore>((set) => ({
  metadata: null,
  stations: null,
  isLoading: false,
  message: null,
  isFetchFail: false,
  selectedStation: null,
  setLoading: (isLoading, options) => {
    set({ isLoading })
    if (options) {
      set({
        isFetchFail: options.isFetchFail,
        message: options.message
      })
    }
  },
  setData: ({ metadata, stations }) => set({ metadata, stations }),
  setSelectedStation: (selectedStation) => set({ selectedStation })
}))
