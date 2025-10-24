import React, { useState, useEffect, useRef } from "react";

// Simple script loader for Google Maps
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.maps) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for it to load
      const checkLoaded = () => {
        if (window.google?.maps) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Create and append script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
};

// Declare Google Maps types
interface PlaceSearchRequest {
  query: string;
  type?: string;
}

interface NewPlaceSearchRequest {
  textQuery: string;
  fields: string[];
  maxResultCount: number;
}

interface NewPlaceResult {
  id: string;
  displayName: string;
  formattedAddress: string;
  location: {
    lat: () => number;
    lng: () => number;
  };
}

interface PlacesLibrary {
  Place: {
    searchByText: (
      request: NewPlaceSearchRequest
    ) => Promise<{ places: NewPlaceResult[] }>;
  };
}

declare global {
  interface Window {
    google?: {
      maps?: {
        importLibrary: (library: string) => Promise<PlacesLibrary>;
        places?: {
          PlacesService: new (element: HTMLElement) => {
            textSearch: (
              request: PlaceSearchRequest,
              callback: (results: PlaceResult[] | null, status: string) => void
            ) => void;
          };
          PlacesServiceStatus: {
            OK: string;
          };
          Place: {
            searchByText: (
              request: NewPlaceSearchRequest
            ) => Promise<{ places: NewPlaceResult[] }>;
          };
        };
      };
    };
  }
}

interface PlaceResult {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance?: number; // Distance in kilometers
}

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get user's current location
const getUserLocation = (): Promise<{ lat: number; lng: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Error getting user location:", error.message);
        resolve(null);
      },
      {
        timeout: 5000,
        enableHighAccuracy: false,
      }
    );
  });
};

interface LocationAutocompleteProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationSelect?: (location: LocationSuggestion) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// Google Places API integration
const initializeGoogle = async (): Promise<boolean> => {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error(
      "Google Places API key not found. Please add VITE_GOOGLE_PLACES_API_KEY to your .env.local file"
    );
    return false;
  }

  if (window.google?.maps?.places) {
    return true;
  }

  try {
    await loadGoogleMapsScript(apiKey);
    return true;
  } catch (error) {
    console.error("Failed to load Google Maps API:", error);
    return false;
  }
};

const searchGooglePlaces = async (
  query: string
): Promise<LocationSuggestion[]> => {
  const isLoaded = await initializeGoogle();
  if (!isLoaded || !window.google?.maps?.places) {
    // Fallback to mock data if Google API fails
    return mockLocationSearch(query);
  }

  try {
    // Get user's location for distance sorting
    const userLocation = await getUserLocation();

    // Use the new Places API (Text Search)
    const placesLibrary = (await window.google.maps.importLibrary(
      "places"
    )) as PlacesLibrary;

    // Create multiple search strategies for better results
    const searchQueries = [
      query, // Direct search first
      `${query} sports`, // Add sports context
      `${query} tennis court`, // Try tennis court
      `${query} padel court`, // Try padel court
      `${query} gym`, // Try gym
    ];

    const allResults: LocationSuggestion[] = [];

    // Try different search queries and combine results
    for (const searchQuery of searchQueries) {
      if (allResults.length >= 20) break; // Stop if we have enough results

      try {
        const request: NewPlaceSearchRequest = {
          textQuery: searchQuery,
          fields: ["displayName", "formattedAddress", "location", "id"],
          maxResultCount: 10,
        };

        const { places: results } = await placesLibrary.Place.searchByText(
          request
        );

        if (results && results.length > 0) {
          const suggestions: LocationSuggestion[] = results.map(
            (place: NewPlaceResult) => {
              const lat = place.location.lat();
              const lng = place.location.lng();

              // Calculate distance if user location is available
              const distance = userLocation
                ? calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    lat,
                    lng
                  )
                : undefined;

              return {
                id: place.id,
                name: place.displayName,
                address: place.formattedAddress,
                coordinates: { lat, lng },
                distance,
              };
            }
          );

          // Add to results, avoiding duplicates
          suggestions.forEach((suggestion) => {
            if (!allResults.some((existing) => existing.id === suggestion.id)) {
              allResults.push(suggestion);
            }
          });
        }
      } catch (error) {
        console.warn(`Search failed for query "${searchQuery}":`, error);
        continue; // Try next query
      }

      // Small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (allResults.length > 0) {
      // Sort by distance if available, otherwise keep original order
      if (userLocation) {
        allResults.sort((a, b) => {
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
      }

      // Return top 8 results
      return allResults.slice(0, 8);
    } else {
      console.warn("No Google Places results found, falling back to mock data");
      return mockLocationSearch(query);
    }
  } catch (error) {
    console.warn(
      "Google Places search failed, falling back to mock data:",
      error
    );
    return mockLocationSearch(query);
  }
};

// Mock location service - fallback when Google API is unavailable
const mockLocationSearch = async (
  query: string
): Promise<LocationSuggestion[]> => {
  if (!query || query.length < 2) return []; // Reduced from 3 to 2

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200)); // Reduced delay

  // Get user location for distance sorting
  const userLocation = await getUserLocation();

  // Mock data - in real implementation, this would be Google Places API or similar
  const mockResults: LocationSuggestion[] = [
    {
      id: "1",
      name: "Central Park Tennis Center",
      address: "Central Park, New York, NY 10024",
      coordinates: { lat: 40.7829, lng: -73.9654 },
    },
    {
      id: "2",
      name: "Tennis Club Amsterdam",
      address: "Vondelpark, Amsterdam, Netherlands",
      coordinates: { lat: 52.3676, lng: 4.8981 },
    },
    {
      id: "3",
      name: "TC Olen Tennis Club",
      address: "Sportlaan 25, 2250 Olen, Belgium",
      coordinates: { lat: 51.1461, lng: 4.8619 },
    },
    {
      id: "4",
      name: "Padel Club Barcelona",
      address: "Carrer de la Marina, Barcelona, Spain",
      coordinates: { lat: 41.3851, lng: 2.1734 },
    },
    {
      id: "5",
      name: "London Tennis Academy",
      address: "Hyde Park, London, UK",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    {
      id: "6",
      name: "TC Olenen Sports Center",
      address: "Kerkstraat 12, 2250 Olen, Belgium",
      coordinates: { lat: 51.1498, lng: 4.8701 },
    },
  ]
    .filter((location) => {
      const queryLower = query.toLowerCase();
      const nameWords = location.name.toLowerCase().split(" ");
      const addressWords = location.address.toLowerCase().split(" ");

      // Check if query matches start of any word in name or address
      return (
        nameWords.some((word) => word.startsWith(queryLower)) ||
        addressWords.some((word) => word.startsWith(queryLower)) ||
        location.name.toLowerCase().includes(queryLower) ||
        location.address.toLowerCase().includes(queryLower)
      );
    })
    .map((location) => {
      // Calculate distance if user location is available
      const distance = userLocation
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            location.coordinates.lat,
            location.coordinates.lng
          )
        : undefined;

      return { ...location, distance };
    });

  // Sort by distance if available
  if (userLocation) {
    mockResults.sort((a, b) => {
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    });
  }

  return mockResults;
};

export function LocationAutocomplete({
  name,
  value,
  onChange,
  onLocationSelect,
  placeholder,
  required,
  className = "",
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [locationPermissionRequested, setLocationPermissionRequested] =
    useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Request location permission on first search
  useEffect(() => {
    if (value.length >= 3 && !locationPermissionRequested) {
      setLocationPermissionRequested(true);
      getUserLocation().then((location) => {
        if (location) {
          console.log("Location access granted for better search results");
        }
      });
    }
  }, [value, locationPermissionRequested]);

  // Debounced search - use Google Places API
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (value.length >= 2) {
        // Reduced from 3 to 2 characters
        setIsLoading(true);
        try {
          const results = await searchGooglePlaces(value);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Location search error:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200); // Reduced from 300ms to 200ms

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleLocationSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    // Create a synthetic event for the onChange handler
    const syntheticEvent = {
      target: {
        name,
        value: location.name,
        type: "text",
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
    onLocationSelect?.(location);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        required={required}
        className={`w-full pl-4 pr-10 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors ${className}`}
        autoComplete="off"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-900 rounded-full"></div>
        </div>
      )}

      {/* Search icon */}
      {!isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                index === highlightedIndex ? "bg-gray-50" : ""
              }`}
              onClick={() => handleLocationSelect(suggestion)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {suggestion.address}
                  </div>
                </div>
                {suggestion.distance !== undefined && (
                  <div className="text-xs text-gray-400 ml-2 mt-1 whitespace-nowrap">
                    {suggestion.distance < 1
                      ? `${Math.round(suggestion.distance * 1000)}m`
                      : `${suggestion.distance.toFixed(1)}km`}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions &&
        !isLoading &&
        suggestions.length === 0 &&
        value.length >= 3 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg">
            <div className="px-4 py-3 text-gray-500 text-sm">
              No locations found. Try a different search term.
            </div>
          </div>
        )}
    </div>
  );
}
