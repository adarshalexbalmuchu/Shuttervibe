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
	{ title: 'Instagram', href: 'https://instagram.com/shuttervibe', icon: Instagram },
	{ title: 'LinkedIn', href: 'https://linkedin.com/in/shuttervibe', icon: Linkedin },
	{ title: 'Email', href: 'mailto:hello@shuttervibe.com', icon: Mail },
];

export function Footer() {
	return (
		<footer id="contact" className="relative w-full border-t border-white/5 bg-black px-6 sm:px-8 md:px-12">
			{/* Subtle top gradient line */}
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
			
			<div className="max-w-7xl mx-auto">
				{/* Main Content */}
				<div className="py-16 sm:py-20 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
					{/* Brand Section - Serif Typography */}
					<AnimatedContainer className="space-y-6 lg:col-span-1">
						<div>
							<h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
								Shuttervibe
							</h2>
							<p className="font-playfair italic text-lg text-white/50">
								by Adarsh Alex Balmuchu
							</p>
						</div>
						<p className="font-inter text-white/40 text-sm leading-relaxed max-w-md font-light">
							Capturing silence inside chaos. Every frame tells a story, every moment holds eternity.
						</p>
					</AnimatedContainer>

					{/* Quick Links - Minimal */}
					<AnimatedContainer delay={0.15} className="space-y-6 lg:col-span-1">
						<h3 className="font-inter text-xs font-medium text-white/50 tracking-[0.2em] uppercase">
							Navigate
						</h3>
						<nav className="flex flex-col space-y-3">
							<a href="#work" className="font-inter text-white/60 hover:text-white text-sm transition-colors duration-300 w-fit">
								Work
							</a>
							<a href="#about" className="font-inter text-white/60 hover:text-white text-sm transition-colors duration-300 w-fit">
								About
							</a>
							<a href="#contact" className="font-inter text-white/60 hover:text-white text-sm transition-colors duration-300 w-fit">
								Contact
							</a>
						</nav>
					</AnimatedContainer>

					{/* Social Links - Horizontal Pills */}
					<AnimatedContainer delay={0.3} className="space-y-6 lg:col-span-1">
						<h3 className="font-inter text-xs font-medium text-white/50 tracking-[0.2em] uppercase">
							Connect
						</h3>
						<div className="flex flex-wrap gap-3">
							{socialLinks.map((link) => (
								<a
									key={link.title}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
									aria-label={link.title}
								>
									<link.icon className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-colors" />
									<span className="font-inter text-xs text-white/60 group-hover:text-white transition-colors">
										{link.title}
									</span>
								</a>
							))}
						</div>
					</AnimatedContainer>
				</div>

				{/* Bottom Bar - Ultra Minimal */}
				<AnimatedContainer delay={0.4} className="border-t border-white/5 py-8">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30">
						<p className="font-inter font-light">
							© {new Date().getFullYear()} Shuttervibe. All rights reserved.
						</p>
						<p className="font-inter font-light">
							Designed & Developed with ❤
						</p>
					</div>
				</AnimatedContainer>
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
