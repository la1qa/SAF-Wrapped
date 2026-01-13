import React from "react";
import logoImage from "../../assets/logo_main.webp";
import { TimeDensity } from "../dashboard/ViolinPlot"; // Adjusted path based on the correct location

interface Props {
  timeDensity: { period: string; count: number }[];
}

export function TimeDensityStory({ timeDensity }: Props) {
  const max = timeDensity[0]?.count ?? 1;

  return (
    <div 
      className="w-full h-full flex flex-col justify-between px-16 py-20"
      style={{
        background: 'linear-gradient(135deg, white 0%, white 10%, #e31139 100%)'
      }}
    >
      {/* Header */}
      <div className="text-center flex flex-col items-center">
        <img 
          src={logoImage} 
          alt="SAF Logo" 
          className="h-22 w-auto mb-4" 
        />
        <h1 className="text-6xl font-bold text-[#e31139] mb-6">
          Wrapped
        </h1>
        <h1 className="text-7xl font-extrabold mt-26 text-gray-900">
          Densitat Temporal
        </h1>
        <p className="text-gray-500 mt-4 text-4xl">
          Quan fas més reserves
        </p>
      </div>

      {/* Violin Plot */}
      <div className="flex flex-col justify-center items-center my-12">
        <TimeDensity data={timeDensity} />
      </div>

      {/* Footer */}
      <div className="text-center text-extrabold text-gray-100 text-4xl mt-12">
        SAF Wrapped · 2025
      </div>
    </div>
  );
}