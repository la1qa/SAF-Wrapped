import React from "react";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import { TopRoomsStory } from "../stories/TopRoomsStory";
import ReactDOM from "react-dom/client";

interface DownloadSectionProps {
  stats: {
    totalReservations: number;
    uniqueDays: number;
    topRooms: { name: string; count: number }[];
    topTimeSlots: { time: string; count: number }[];
  };
}

const downloadStory = async (storyComponent: React.ReactNode, filename: string) => {
  try {
    const wrapper = document.createElement("div");
    wrapper.style.width = "1080px";
    wrapper.style.height = "1920px";
    wrapper.style.background = "linear-gradient(135deg, white 0%, white 10%, #e31139 100%)";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.fontFamily = "Inter, system-ui, sans-serif";
    wrapper.style.background = "linear-gradient(135deg, white 0%, white 10%, #e31139 100%)";
    document.body.appendChild(wrapper);
    
    const root = ReactDOM.createRoot(wrapper);
    root.render(storyComponent);
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert all images to data URLs
    const images = wrapper.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(async (img) => {
        if (img.src.startsWith('data:')) return; // Already a data URL
        
        try {
          const response = await fetch(img.src);
          const blob = await response.blob();
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          img.src = dataUrl;
        } catch (err) {
          console.warn('Failed to convert image to data URL:', img.src, err);
        }
      })
    );

    const dataUrl = await toPng(wrapper, {
      cacheBust: true,
      pixelRatio: 2,
      skipFonts: true,
    });

    root.unmount();
    document.body.removeChild(wrapper);

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${filename}-${new Date().toLocaleDateString("ca-ES")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error downloading image:", err);
    alert("Error downloading image. Check console for details.");
  }
};

/* ---------------------------------- */
/* Reusable Button                    */
/* ---------------------------------- */

interface DownloadButtonProps {
  label: string;
  color: string;
  onClick: () => void;
}

function DownloadButton({
  label,
  color,
  onClick,
}: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-6 py-4 rounded-xl font-semibold
        transition-all duration-200
        bg-${color}-100 text-${color}-700
        hover:bg-${color}-200 hover:-translate-y-0.5
        active:translate-y-0
        shadow-sm hover:shadow-md
      `}
    >
      <span className={`p-2 rounded-lg bg-${color}-200`}>
        <Download className="w-5 h-5" />
      </span>
      {label}
    </button>
  );
}

/* ---------------------------------- */
/* Main Component                     */
/* ---------------------------------- */

export default function DownloadSection({
  stats,
}: DownloadSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Comparteix el teu SAF Wrapped ✨
      </h2>
      <p className="text-gray-500 mb-8">
        Descarrega les teves estadístiques en format Instagram Story
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DownloadButton
          label="Estadístiques"
          color="blue"
          onClick={() => downloadStory(<TopRoomsStory topRooms={stats.topRooms} />, "SAF-Wrapped-Stats")}
        />
        <DownloadButton
          label="Top Reserves"
          color="purple"
          onClick={() => downloadStory(<TopRoomsStory topRooms={stats.topRooms} />, "SAF-Wrapped-TopRooms")}
        />
        <DownloadButton
          label="Ratxes"
          color="orange"
          onClick={() => downloadStory(<TopRoomsStory topRooms={stats.topRooms} />, "SAF-Wrapped-Streaks")}
        />
        <DownloadButton
          label="Densitat horària"
          color="green"
          onClick={() => downloadStory(<TopRoomsStory topRooms={stats.topRooms} />, "SAF-Wrapped-TimeDensity")}
        />
      </div>
    </div>
  );
}
