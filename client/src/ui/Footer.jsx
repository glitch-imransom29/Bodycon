import React from 'react'
import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Heart, Send } from "react-feather"

export default function Footer() {
	return (
		<footer className="bg-[#1a1a1a] text-white">
			{/* Newsletter Section */}
			<div className="border-b border-white/10">
				<div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="text-center md:text-left">
						<h3 className="font-['Playfair_Display'] text-3xl font-bold mb-2">Join the Bodycon Club</h3>
						<p className="text-[#e8d5c4]/80">Get 15% off your first order + exclusive access to new arrivals</p>
					</div>
					<div className="flex w-full md:w-auto">
						<input 
							type="email" 
							placeholder="Enter your email" 
							className="flex-1 md:w-80 px-6 py-4 bg-white/10 border border-white/20 rounded-l-full text-white placeholder-white/50 focus:outline-none focus:border-[#d4a574]"
						/>
						<button className="px-8 py-4 bg-[#d4a574] text-white font-medium rounded-r-full hover:bg-[#c9a86c] transition-colors flex items-center gap-2">
							<Send className="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>

			{/* Main Footer */}
			<div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
				{/* Brand */}
				<div className="md:col-span-1">
					<Link to="/" className="inline-block mb-6">
						<h2 className="font-['Playfair_Display'] text-3xl font-bold text-white">BODYCON</h2>
						<span className="text-xs tracking-[0.3em] text-[#d4a574]">LUXURY FASHION</span>
					</Link>
					<p className="text-white/60 text-sm leading-relaxed mb-6">
						Elevate your style with our curated collection of premium women's fashion. Designed for the modern woman who demands elegance and comfort.
					</p>
					<ul className="flex space-x-4">
						<li>
							<a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#d4a574] transition-colors">
								<Facebook className="w-5 h-5" />
							</a>
						</li>				
						<li>
							<a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#d4a574] transition-colors">
								<Instagram className="w-5 h-5" />
							</a>
						</li>				
						<li>
							<a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#d4a574] transition-colors">
								<Twitter className="w-5 h-5" />
							</a>
						</li>
					</ul>
				</div>
				
				{/* Shop */}
				<div>
					<h3 className="font-['Playfair_Display'] text-lg font-semibold mb-6 text-[#d4a574]">Shop</h3>
					<ul className="space-y-3 text-white/60">
						<li><Link to="/products?category=dresses" className="hover:text-[#d4a574] transition-colors">Dresses</Link></li>
						<li><Link to="/products?category=tops" className="hover:text-[#d4a574] transition-colors">Tops & Blouses</Link></li>
						<li><Link to="/products?category=bottoms" className="hover:text-[#d4a574] transition-colors">Bottoms</Link></li>
						<li><Link to="/products?category=sets" className="hover:text-[#d4a574] transition-colors">Co-ord Sets</Link></li>
						<li><Link to="/products" className="hover:text-[#d4a574] transition-colors">New Arrivals</Link></li>
						<li><Link to="/products?sale=true" className="hover:text-[#d4a574] transition-colors">Sale</Link></li>
					</ul>
				</div>
				
				{/* Help */}
				<div>
					<h3 className="font-['Playfair_Display'] text-lg font-semibold mb-6 text-[#d4a574]">Help</h3>
					<ul className="space-y-3 text-white/60">
						<li><Link to="/orders" className="hover:text-[#d4a574] transition-colors">Track Order</Link></li>
						<li><Link to="/shipping" className="hover:text-[#d4a574] transition-colors">Shipping Info</Link></li>
						<li><Link to="/returns" className="hover:text-[#d4a574] transition-colors">Returns & Exchanges</Link></li>
						<li><Link to="/size-guide" className="hover:text-[#d4a574] transition-colors">Size Guide</Link></li>
						<li><Link to="/faq" className="hover:text-[#d4a574] transition-colors">FAQs</Link></li>
						<li><Link to="/contact" className="hover:text-[#d4a574] transition-colors">Contact Us</Link></li>
					</ul>
				</div>
				
				{/* Contact */}
				<div>
					<h3 className="font-['Playfair_Display'] text-lg font-semibold mb-6 text-[#d4a574]">Contact</h3>
					<ul className="space-y-4 text-white/60">
						<li className="flex items-start gap-3">
							<MapPin className="w-5 h-5 text-[#d4a574] flex-shrink-0 mt-0.5" />
							<span>123 Fashion Street, Mumbai, Maharashtra 400001, India</span>
						</li>					
						<li className="flex items-center gap-3">
							<Phone className="w-5 h-5 text-[#d4a574] flex-shrink-0" />
							<span>+91 98765 43210</span>
						</li>					
						<li className="flex items-center gap-3">
							<Mail className="w-5 h-5 text-[#d4a574] flex-shrink-0" />
							<a href="mailto:hello@bodycon.in" className="hover:text-[#d4a574] transition-colors">
								hello@bodycon.in
							</a>
						</li>
					</ul>
					<div className="mt-8">
						<p className="text-xs text-white/40 mb-3">We Accept</p>
						<div className="flex gap-2">
							<div className="px-3 py-2 bg-white/10 rounded text-xs">Visa</div>
							<div className="px-3 py-2 bg-white/10 rounded text-xs">Mastercard</div>
							<div className="px-3 py-2 bg-white/10 rounded text-xs">UPI</div>
							<div className="px-3 py-2 bg-white/10 rounded text-xs">COD</div>
						</div>
					</div>
				</div>
			</div>
			
			{/* Bottom Bar */}
			<div className="border-t border-white/10">
				<div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-white/40 text-sm">
						© 2026 Bodycon. All rights reserved.
					</p>
					<div className="flex items-center gap-6 text-white/40 text-sm">
						<Link to="/privacy" className="hover:text-[#d4a574] transition-colors">Privacy Policy</Link>
						<Link to="/terms" className="hover:text-[#d4a574] transition-colors">Terms of Service</Link>
					</div>
					<p className="text-white/40 text-sm flex items-center gap-1">
						Made with <Heart className="w-4 h-4 text-[#d4a574] fill-current" /> in India
					</p>
				</div>
			</div>
		</footer>
	)
}