"use client";

import { useState } from "react";
import { GalleryGrid, GalleryImage } from "./gallery-grid";
import { Lightbox } from "./lightbox";

const gallerySections = [
  {
    id: "portraits",
    title: "Portraits",
    description: "The human face, a canvas of untold stories",
    images: [
      { id: "p1", url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=60&auto=format", title: "Silent Strength", location: "Mumbai", year: "2024" },
      { id: "p2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=60&auto=format", title: "Urban Soul", location: "Delhi", year: "2024" },
      { id: "p3", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=60&auto=format", title: "Grace", location: "Kolkata", year: "2023" },
      { id: "p4", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=60&auto=format", title: "Resilience", location: "Bangalore", year: "2024" },
      { id: "p5", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=60&auto=format", title: "Contemplation", location: "Chennai", year: "2023" },
      { id: "p6", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=60&auto=format", title: "Depth", location: "Pune", year: "2024" },
    ]
  },
  {
    id: "street",
    title: "Street",
    description: "Life unfiltered, moments unscripted",
    images: [
      { id: "s1", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=60&auto=format", title: "Morning Rush", location: "Mumbai", year: "2024" },
      { id: "s2", url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=60&auto=format", title: "Market Tales", location: "Delhi", year: "2024" },
      { id: "s3", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=60&auto=format", title: "City Pulse", location: "Bangalore", year: "2023" },
      { id: "s4", url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=60&auto=format", title: "Night Vendors", location: "Kolkata", year: "2024" },
      { id: "s5", url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&q=60&auto=format", title: "Monsoon Streets", location: "Mumbai", year: "2023" },
      { id: "s6", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=60&auto=format", title: "Urban Rhythm", location: "Pune", year: "2024" },
      { id: "s7", url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=60&auto=format", title: "Commute", location: "Chennai", year: "2024" },
      { id: "s8", url: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=600&q=60&auto=format", title: "Evening Glow", location: "Delhi", year: "2023" },
    ]
  },
  {
    id: "nature",
    title: "Nature",
    description: "Earth's poetry written in light and shadow",
    images: [
      { id: "n1", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=60&auto=format", title: "Mountain Solitude", location: "Himalayas", year: "2023" },
      { id: "n2", url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=60&auto=format", title: "Coastal Dreams", location: "Goa", year: "2023" },
      { id: "n3", url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=60&auto=format", title: "Monsoon Magic", location: "Kerala", year: "2024" },
      { id: "n4", url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=60&auto=format", title: "Desert Whispers", location: "Rajasthan", year: "2024" },
      { id: "n5", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=60&auto=format", title: "Forest Depths", location: "Meghalaya", year: "2023" },
      { id: "n6", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=60&auto=format", title: "Valley Vista", location: "Kashmir", year: "2024" },
    ]
  }
];

export function CategorizedGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentSectionId, setCurrentSectionId] = useState<string>("");

  const handleImageClick = (image: GalleryImage, sectionId: string) => {
    setSelectedImage(image);
    setCurrentSectionId(sectionId);
  };

  const getCurrentImages = () => {
    const section = gallerySections.find(s => s.id === currentSectionId);
    return section?.images || [];
  };

  const handleNext = () => {
    const images = getCurrentImages();
    const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const handlePrev = () => {
    const images = getCurrentImages();
    const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  return (
    <>
      <div className="relative bg-black py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-20 sm:space-y-24 md:space-y-28 lg:space-y-32">
          {gallerySections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              {/* Section Header */}
              <div className="mb-8 sm:mb-10 md:mb-12">
                <h2 
                  className="text-white font-light mb-2 sm:mb-3"
                  style={{ fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.1 }}
                >
                  {section.title}
                </h2>
                <p 
                  className="text-gray-400 italic"
                  style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
                >
                  {section.description}
                </p>
              </div>

              {/* Gallery Grid */}
              <GalleryGrid 
                images={section.images} 
                onImageClick={(img) => handleImageClick(img, section.id)} 
              />
            </section>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}
