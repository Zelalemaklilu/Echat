import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getChatWallpaper, getWallpaperStyle, setChatWallpaper, getPresetWallpapers, type WallpaperConfig } from "@/lib/chatWallpaperService";
import { toast } from "sonner";

interface WallpaperPickerProps {
  chatId: string;
  onClose: () => void;
}

export function WallpaperPicker({ chatId, onClose }: WallpaperPickerProps) {
  const wallpapers = getPresetWallpapers();
  const currentWallpaper = getChatWallpaper(chatId);

  const handleSelect = (wp: WallpaperConfig) => {
    setChatWallpaper(chatId, wp);
    toast.success("Wallpaper updated!");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-lg p-4 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Chat Wallpaper</h3>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-wallpaper">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {wallpapers.map((wp, i) => (
            <button
              key={i}
              onClick={() => handleSelect(wp)}
              data-testid={`button-wallpaper-${i}`}
              className={`aspect-[3/4] rounded-md border-2 transition-transform hover:scale-105 ${
                JSON.stringify(currentWallpaper) === JSON.stringify(wp) ? 'border-primary' : 'border-border'
              }`}
              style={{
                ...getWallpaperStyle(wp),
                backgroundColor: wp.value === 'transparent' ? 'hsl(var(--background))' : undefined,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
