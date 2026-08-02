export interface ScrapeResult {
  company: string;
  industry: string;
  amount: number;
  city: string;
  address: string;
  phone: string;
  contact: string;
  painPoint: string;
  score: number;
  guiacoresUrl: string;
  rating?: number;
  website?: string;
}

/**
 * Servicio de Prospección con Scraping Real de Google Maps mediante Apify.
 * Se conecta a la API proxy del servidor para ocultar de manera segura la clave API de Apify.
 */
export async function scrapeGooglePlaces(city: string, industry: string): Promise<ScrapeResult[]> {
  try {
    console.log(`[Scraper Service] Iniciando prospección de Google Maps real para ${industry} en ${city}...`);
    
    // Intentamos obtener los datos del endpoint backend
    const response = await fetch("/api/scrape-places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city, industry }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error del servidor (HTTP ${response.status})`);
    }

    const data = await response.json();
    return data.prospects || [];
  } catch (error: any) {
    console.error("[Scraper Service] Error en scrapeGooglePlaces:", error);
    throw error;
  }
}
