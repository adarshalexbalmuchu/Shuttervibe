"use client";

import { CircularGallery, GalleryItem } from './circular-gallery';

const featuredProjects: GalleryItem[] = [
  {
    common: "Urban Pulse",
    binomial: "Mumbai, India",
    photo: {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=600&q=60&auto=format&fit=crop",
      text: "Capturing the vibrant energy of Mumbai's streets",
      pos: "center",
      by: "Adarsh"
    }
  },
  {
    common: "Mountain Solitude",
    binomial: "Himalayas, 2023",
    photo: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=600&q=60&auto=format&fit=crop",
      text: "Serene peaks touching the sky",
      pos: "center",
      by: "Adarsh"
    }
  },
  {
    common: "Street Stories",
    binomial: "Delhi, India",
    photo: {
      url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=600&q=60&auto=format&fit=crop",
      text: "Life unfolds in the capital's lanes",
      pos: "center",
      by: "Adarsh"
    }
  },
  {
    common: "Coastal Dreams",
    binomial: "Goa, 2023",
    photo: {
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=600&q=60&auto=format&fit=crop",
      text: "Where the ocean meets tranquility",
      pos: "center",
      by: "Adarsh"
    }
  },
  {
    common: "Desert Whispers",
    binomial: "Rajasthan, India",
    photo: {
      url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=500&h=600&q=60&auto=format&fit=crop",
      text: "Golden sands tell ancient tales",
      pos: "center",
      by: "Adarsh"
    }
  },
  {
    common: "Monsoon Magic",
    binomial: "Kerala, 2024",
    photo: {
      url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=1000&fit=crop",
      text: "Rain-kissed landscapes of God's Own Country",
      pos: "center",
      by: "Adarsh"
    }
  },
  {
    common: "Heritage Echoes",
    binomial: "Jaipur, India",
    photo: {
      url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&h=600&q=60&auto=format&fit=crop",
      text: "Royal architecture frozen in time",
      pos: "center",
      by: "Adarsh"
    }
  },
  {
    common: "River Rhythms",
    binomial: "Varanasi, India",
    photo: {
      url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&h=600&q=60&auto=format&fit=crop",
      text: "The eternal flow of the Ganges",
      pos: "center",
      by: "Adarsh"
    }
  }
];

export default function FeaturedProjects() {
  return (
    <section className="relative min-h-screen py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 sm:mb-14 md:mb-16 text-center">
          <h2 
            className="text-white font-light mb-3 sm:mb-4"
            style={{ fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.1 }}
          >
            Featured Stories
          </h2>
          <p 
            className="text-gray-400"
            style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
          >
            A curated selection of my most impactful work
          </p>
        </div>

        {/* Circular 3D Gallery */}
        <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]">
          <CircularGallery 
            items={featuredProjects} 
            radius={600}
            autoRotateSpeed={0.02}
          />
        </div>
      </div>
    </section>
  );
}
