// Default recommendations (fallback for new users or when personalization is unavailable)
// Personalized recommendations are generated dynamically in each index.html (v2.2.0)
// based on browsing history (localStorage 'bx_history') when >= 3 items viewed
// Algorithm: tag frequency from history → score unviewed items → top 12
// First five follow GA4 copy events from 2026-08-29 to 2026-09-27 JST.
// The remaining styles keep their relative order from the 2026-02-19 list.
window.recommendations = [
  "nano_42",  // Doodle / Notebook / Cute
  "nano_97",  // Doodle / Notebook / Blue Ink
  "nano_178", // Clay / Stopmotion / Cute
  "nano_73",  // Flat illustration / Corporate / Memphis
  "nano_93",  // Infographic / Isometric / Colorful
  "nano_279", // Handwritten / Chalk / Casual
  "nano_180", // Manga / Shoujo / Sparkle
  "nano_01",  // Vector art / Corporate / Minimal
  "nano_289", // Tilt-shift / Miniature / Blur
  "nano_173", // Minimal / Line / White
  "nano_184", // Watercolor / Map / Fantasy
  "nano_86",  // Knolling / Pastel / Stationery
  "nano_283", // 13. Black&White / Portrait / Light (200)
  "nano_111", // 14. Minimal / Monochrome / Line Art (199)
  "nano_51",  // 15. Manga / Screen Tone / Monochrome (186)
  "nano_150", // 16. Neumorphism / Soft / White (180)
  "nano_148", // 17. Collage / Vintage / Flower (179)
  "nano_109", // 18. Paper Cutout / Shadow box / Pastel (173)
  "nano_28",  // 19. Paper Craft / Layered / Shadow (166)
  "nano_47",  // 20. Infographic / Isometric / Data (166)
  "nano_239", // 21. Blueprint / Architecture / Blue (156)
  "nano_39",  // 22. Corporate / Memphis / Playful (150)
  "nano_143", // 23. Manga / Screen Tone / Action (143)
  "nano_25",  // 24. Neumorphism / Soft Shadow / Light (142)
  "nano_177", // 25. Blueprint / Architecture / White (133)
  "nano_229", // 26. Neon / Black / Light (125)
  "nano_266", // 27. Minimal / White / Form (122)
  "nano_120", // 28. Clay Render / Plastic / Toy (115)
  "nano_55",  // 29. Claymorphism / Pastel / Rounded (111)
  "nano_243"  // 30. Pixel Art / Retro Game / 8-bit (110)
];
