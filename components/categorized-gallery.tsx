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
      { id: "p1", url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", title: "Silent Strength", location: "Mumbai", year: "2024" },
      { id: "p2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", title: "Urban Soul", location: "Delhi", year: "2024" },
      { id: "p3", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", title: "Grace", location: "Kolkata", year: "2023" },
      { id: "p4", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80", title: "Resilience", location: "Bangalore", year: "2024" },
      { id: "p5", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80", title: "Contemplation", location: "Chennai", year: "2023" },
      { id: "p6", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80", title: "Depth", location: "Pune", year: "2024" },
    ]
  },
  {
    id: "street",
    title: "Street",
    description: "Life unfiltered, moments unscripted",
    images: [
      { id: "s1", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", title: "Morning Rush", location: "Mumbai", year: "2024" },
      { id: "s2", url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80", title: "Market Tales", location: "Delhi", year: "2024" },
      { id: "s3", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", title: "City Pulse", location: "Bangalore", year: "2023" },
      { id: "s4", url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80", title: "Night Vendors", location: "Kolkata", year: "2024" },
      { id: "s5", url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80", title: "Monsoon Streets", location: "Mumbai", year: "2023" },
      { id: "s6", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80", title: "Urban Rhythm", location: "Pune", year: "2024" },
      { id: "s7", url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80", title: "Commute", location: "Chennai", year: "2024" },
      { id: "s8", url: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=800&q=80", title: "Evening Glow", location: "Delhi", year: "2023" },
    ]
  },
  {
    id: "nature",
    title: "Nature",
    description: "Earth's poetry written in light and shadow",
    images: [
      { id: "n1", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", title: "Mountain Solitude", location: "Himalayas", year: "2023" },
      { id: "n2", url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", title: "Coastal Dreams", location: "Goa", year: "2023" },
      { id: "n3", url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80", title: "Monsoon Magic", location: "Kerala", year: "2024" },
      { id: "n4", url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80", title: "Desert Whispers", location: "Rajasthan", year: "2024" },
      { id: "n5", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80", title: "Forest Depths", location: "Meghalaya", year: "2023" },
      { id: "n6", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", title: "Valley Vista", location: "Kashmir", year: "2024" },
    ]
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "Geometry meets time in stone and steel",
    images: [
      { id: "a1", url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80", title: "Heritage Echoes", location: "Jaipur", year: "2024" },
      { id: "a2", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80", title: "Modern Lines", location: "Mumbai", year: "2024" },
      { id: "a3", url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80", title: "Urban Patterns", location: "Bangalore", year: "2023" },
      { id: "a4", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", title: "City Geometry", location: "Dubai", year: "2024" },
      { id: "a5", url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80", title: "Colonial Legacy", location: "Kolkata", year: "2023" },
      { id: "a6", url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=80", title: "Steel Dreams", location: "Delhi", year: "2024" },
    ]
  },
  {
    id: "abstract",
    title: "Abstract",
    description: "Beyond reality, within perception",
    images: [
      { id: "ab1", url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80", title: "Light Play", location: "Studio", year: "2024" },
      { id: "ab2", url: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800&q=80", title: "Color Fields", location: "Workshop", year: "2024" },
      { id: "ab3", url: "https://images.unsplash.com/photo-1551732998-9d98c3d6e4f4?w=800&q=80", title: "Textures", location: "Mumbai", year: "2023" },
      { id: "ab4", url: "https://images.unsplash.com/photo-1524169358666-79f22534bc6e?w=800&q=80", title: "Reflections", location: "Goa", year: "2024" },
      { id: "ab5", url: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&q=80", title: "Shadows", location: "Delhi", year: "2023" },
      { id: "ab6", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80", title: "Gradients", location: "Bangalore", year: "2024" },
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
