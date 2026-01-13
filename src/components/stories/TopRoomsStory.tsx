import React from "react";
import logoImage from "../../assets/logo_main.webp";

interface Props {
  topRooms: { name: string; count: number }[];
}

export function TopRoomsStory({ topRooms }: Props) {
  const max = topRooms[0]?.count ?? 1;

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
          Top de Reserves
        </h1>
        <p className="text-gray-500 mt-4 text-4xl">
          Els espais que més has utilitzat
        </p>
      </div>

      {/* Champion */}
      <div className="text-center my-12">
        <div className="text-8xl font-black text-blue-600">
          {topRooms[0].name}
        </div>
        <div className="text-5xl text-gray-500 mt-2">
          {topRooms[0].count} reserves
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-10">
        {topRooms.map(room => (
          <div key={room.name}>
            <div className="flex justify-between mb-4 text-4xl font-semibold">
              <span>{room.name}</span>
              <span>{room.count}</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full">
              <div
                className="h-4 bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${(room.count / max) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-extrabold text-gray-100 text-4xl mt-12">
        SAF Wrapped · 2025
      </div>
    </div>
  );
}