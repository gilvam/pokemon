import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  async getCity(): Promise<string | null> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return null;
    }

    const position = await new Promise<GeolocationPosition | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        () => resolve(null),
        { timeout: 5000 },
      );
    });

    if (!position) {
      return null;
    }

    try {
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      );
      const data = await response.json();
      return data?.address?.city ?? data?.address?.town ?? data?.address?.village ?? null;
    } catch {
      return null;
    }
  }
}
