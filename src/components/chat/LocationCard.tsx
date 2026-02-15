import { Card } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { getStaticMapUrl, formatCoordinates, getGoogleMapsLink } from "@/lib/locationService";

interface LocationCardProps {
  latitude: number;
  longitude: number;
  isOwn: boolean;
}

export function LocationCard({ latitude, longitude, isOwn }: LocationCardProps) {
  const mapUrl = getStaticMapUrl(latitude, longitude);
  const coordinates = formatCoordinates(latitude, longitude);
  const mapsLink = getGoogleMapsLink(latitude, longitude);

  return (
    <Card
      data-testid="location-card"
      className="overflow-visible rounded-md max-w-[280px]"
    >
      <div className="rounded-t-md overflow-hidden">
        <iframe
          src={mapUrl}
          width="280"
          height="150"
          className="border-0 block"
          title="Shared location"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span data-testid="text-coordinates">{coordinates}</span>
        </div>
        <a
          data-testid="link-open-maps"
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover-elevate rounded-md px-2 py-1 w-fit"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open in Maps
        </a>
      </div>
    </Card>
  );
}
