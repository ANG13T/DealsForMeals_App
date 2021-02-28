export interface Location {
    latitude: number;
    longitude: number;
    fullAddress: string;
    countryCode?: string;
    postalCode?: string;
    administrativeArea?: string;
    subAdministrativeArea?: string;
    locality?: string;
    subLocality?: string;
    thoroughfare?: string;
    subThoroughfare?: string;
  }