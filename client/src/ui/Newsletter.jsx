import React from 'react'
import { Mail } from "react-feather"

import Input from "@/components/Input"
import Button from "@/components/Button"

export default function Newsletter() {
	return (
		<div className="max-w-2xl m-4 sm:mx-auto rounded-2xl text-center border-2 border-gray-300 p-8 bg-gray-800">
			<h2 className="text-4xl font-bold mb-3 text-white">Stay in Style</h2>
			<p className="text-lg text-gray-300">Subscribe to get exclusive access to new arrivals and special offers.</p>
			<form className="max-w-xl flex mx-auto mt-8 mb-4">
				<Input
					icon={<Mail className="text-gray-400" />}
					type="email" 
					placeholder="Your Email" 
					required
					className="!bg-gray-700 !border-gray-600 !text-white"
				/>
				<Button type="submit" className="!rounded-r-full">Subscribe</Button>
			</form>
			<p className="text-gray-400 text-sm">Join 50,000+ fashion lovers</p>
		</div>
	)
}