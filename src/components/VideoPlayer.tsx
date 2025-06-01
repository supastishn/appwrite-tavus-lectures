import React, { useState } from 'react';


export default function VideoPlayer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/40 via-white to-primary-dark/30 flex items-center justify-center">
      <div className="backdrop-blur-lg bg-white/80 border border-gray-200 p-10 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-primary-dark tracking-tight drop-shadow">Video Player</h2>
        <video
          controls
          className="w-full h-auto rounded-2xl shadow-lg border border-gray-200"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
