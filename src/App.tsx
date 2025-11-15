import { useState } from "react";
import Player from "./Player";
import surahs from "../lib/surahs.json"; // your JSON file

interface Surah {
  id: number;
  name_ar: string;
  name_en: string;
  url: string;
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Playlist */}
      <div className="flex-1 overflow-y-auto p-4">
        <h1 className="text-2xl font-bold mb-4">📖 Quran Playlist</h1>
        <ul className="space-y-2">
          {surahs.map((surah: Surah, index: number) => (
            <li
              key={surah.id}
              className={`p-3 rounded-lg cursor-pointer transition ${
                index === currentIndex
                  ? "bg-green-100 font-semibold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              {surah.id}. {surah.name_ar} ({surah.name_en})
            </li>
          ))}
        </ul>
      </div>

      {/* Audio Player at the bottom */}
      <Player
        surahs={surahs}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
