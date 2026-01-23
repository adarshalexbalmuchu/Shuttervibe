'use client';

import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Instagram, Mail, Linkedin } from 'lucide-react';

interface SocialLink {
	title: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}

const socialLinks: SocialLink[] = [
	{ title: 'Instagram', href: 'https://www.instagram.com/shuttervibez12/', icon: Instagram },
	{ title: 'LinkedIn', href: 'https://www.linkedin.com/in/adarshalexbalmuhu', icon: Linkedin },
	{ title: 'Email', href: 'mailto:adarshbalmuchu@gmail.com', icon: Mail },
];

export function Footer() {
	return (
		<footer id="contact" className="relative w-full border-t border-white/5 bg-black px-6 sm:px-8 md:px-12">
			{/* Subtle top gradient line */}
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
			
			<div className="max-w-5xl mx-auto">
				{/* Centered Simple Layout */}
				<div className="py-16 sm:py-20 md:py-24 flex flex-col items-center text-center space-y-10 sm:space-y-12">
					{/* Brand Section */}
					<AnimatedContainer className="space-y-3 sm:space-y-4">
						<h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>
							Shuttervibe
						</h2>
						<p className="font-playfair italic text-lg sm:text-xl text-white/50">
							by Adarsh Alex Balmuchu
						</p>
					</AnimatedContainer>

					{/* Social Links - Simple Icons */}
					<AnimatedContainer delay={0.15} className="flex items-center gap-5 sm:gap-6">
						{socialLinks.map((link) => (
							<a
								key={link.title}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="group touch-manipulation"
								aria-label={link.title}
							>
								<div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/[0.08] group-active:bg-white/[0.12] transition-all duration-300">
									<link.icon className="w-6 h-6 sm:w-5 sm:h-5 text-white/60 group-hover:text-white transition-colors" />
								</div>
							</a>
						))}
					</AnimatedContainer>

					{/* Bottom Text */}
					<AnimatedContainer delay={0.3} className="space-y-2">
						<p className="font-inter text-white/40 text-sm leading-relaxed max-w-md font-light">
							Capturing silence inside chaos.
						</p>
						<p className="font-inter text-xs text-white/30 font-light">
							© {new Date().getFullYear()} Shuttervibe. All rights reserved.
						</p>
					</AnimatedContainer>
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
