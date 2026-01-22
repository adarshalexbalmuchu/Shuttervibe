'use client';

import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Instagram, Mail, Linkedin, Camera } from 'lucide-react';

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
		<footer className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl md:rounded-t-6xl border-t border-white/10 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
			{/* Top glow line */}
			<div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur" />

			<div className="grid w-full gap-12 lg:grid-cols-3 lg:gap-8">
				{/* Brand Section */}
				<AnimatedContainer className="space-y-4 lg:col-span-1">
					<div className="flex items-center gap-2">
						<Camera className="w-8 h-8 text-white" strokeWidth={1.5} />
						<h3 className="text-2xl font-light tracking-wider text-white">
							Shuttervibe
						</h3>
					</div>
					<p className="text-white/60 text-sm leading-relaxed max-w-xs">
						Capturing moments through the lens of creativity. 
						Visual storytelling that resonates.
					</p>
					<p className="text-white/40 text-xs mt-6">
						© {new Date().getFullYear()} Shuttervibe. All rights reserved.
					</p>
				</AnimatedContainer>

				{/* About Section */}
				<AnimatedContainer delay={0.2} className="space-y-4 lg:col-span-1">
					<h3 className="text-sm font-medium text-white/90 tracking-wide uppercase">
						About
					</h3>
					<p className="text-white/60 text-sm leading-relaxed">
						I'm a passionate photographer specializing in portrait, street, and nature photography. 
						Each frame tells a unique story, capturing the essence of moments that matter.
					</p>
				</AnimatedContainer>

				{/* Social Links Section */}
				<AnimatedContainer delay={0.3} className="space-y-4 lg:col-span-1">
					<h3 className="text-sm font-medium text-white/90 tracking-wide uppercase">
						Connect
					</h3>
					<div className="flex flex-col space-y-3">
						{socialLinks.map((link) => (
							<a
								key={link.title}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300"
							>
								<div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all duration-300">
									<link.icon className="w-4 h-4" strokeWidth={1.5} />
								</div>
								<span className="text-sm">{link.title}</span>
							</a>
						))}
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
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8, ease: 'easeOut' }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
