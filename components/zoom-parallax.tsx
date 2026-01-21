'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	// Reduced scale values for mobile
	const scale4 = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 3 : 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 3.5 : 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 4 : 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 5 : 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 6 : 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[400vh]">
			<div className="sticky top-0 h-screen overflow-hidden bg-black">
				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center
								${index === 1 ? 'md:[&>div]:!-top-[30vh] md:[&>div]:!left-[5vw] [&>div]:!-top-[20vh] [&>div]:!left-[10vw] [&>div]:!h-[25vh] md:[&>div]:!h-[30vh] [&>div]:!w-[45vw] md:[&>div]:!w-[35vw]' : ''} 
								${index === 2 ? 'md:[&>div]:!-top-[10vh] md:[&>div]:!-left-[25vw] [&>div]:!-top-[5vh] [&>div]:!-left-[15vw] [&>div]:!h-[30vh] md:[&>div]:!h-[45vh] [&>div]:!w-[35vw] md:[&>div]:!w-[20vw]' : ''} 
								${index === 3 ? 'md:[&>div]:!left-[27.5vw] [&>div]:!left-[15vw] [&>div]:!h-[22vh] md:[&>div]:!h-[25vh] [&>div]:!w-[40vw] md:[&>div]:!w-[25vw]' : ''} 
								${index === 4 ? 'md:[&>div]:!top-[27.5vh] [&>div]:!top-[20vh] md:[&>div]:!left-[5vw] [&>div]:!left-[5vw] [&>div]:!h-[20vh] md:[&>div]:!h-[25vh] [&>div]:!w-[35vw] md:[&>div]:!w-[20vw]' : ''} 
								${index === 5 ? 'md:[&>div]:!top-[27.5vh] [&>div]:!top-[20vh] md:[&>div]:!-left-[22.5vw] [&>div]:!-left-[15vw] [&>div]:!h-[20vh] md:[&>div]:!h-[25vh] [&>div]:!w-[45vw] md:[&>div]:!w-[30vw]' : ''} 
								${index === 6 ? 'md:[&>div]:!top-[22.5vh] [&>div]:!top-[15vh] md:[&>div]:!left-[25vw] [&>div]:!left-[20vw] [&>div]:!h-[12vh] md:[&>div]:!h-[15vh] [&>div]:!w-[25vw] md:[&>div]:!w-[15vw]' : ''} 
							`}
						>
							<div className="relative h-[20vh] w-[40vw] md:h-[25vh] md:w-[25vw]">
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									className="h-full w-full object-cover rounded-lg shadow-2xl"
									loading="lazy"
								/>
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
