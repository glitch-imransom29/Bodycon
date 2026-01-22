import React, { useState, useEffect } from 'react';
import clsx from "clsx"
import { ChevronLeft, ChevronRight, ArrowRight } from 'react-feather';
import { Link } from 'react-router-dom';

import Button from "@/components/Button"

export default function Slider({ slides }) {
  const [current, setCurrent] = useState(0)
  const length = slides.length

  const nextSlide = () => setCurrent(curr => curr === length - 1 ? 0 : curr + 1)
  const prevSlide = () => setCurrent(curr => curr === 0 ? length - 1 : curr - 1)

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  if (!Array.isArray(slides) || slides.length <= 0) return null

  return (
    <div className="w-full h-screen relative flex justify-center overflow-hidden" style={{backgroundColor: '#1a1a1a'}}>
      {slides.map((slide, index) => (
        <div
          key={index}
        	className={clsx(
        		"absolute inset-0 transition-all duration-1000 ease-in-out",
        		index === current ? "opacity-100 scale-100": "opacity-0 scale-105",
        	)}
        >
          {index === current && (<>
            <img
            	src={slide.image} 
            	alt='slider image' 
            	className='w-full h-full object-cover object-center'
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0" style={{background: 'linear-gradient(to right, rgba(26,26,26,0.85) 0%, rgba(26,26,26,0.4) 50%, transparent 100%)'}}></div>
            <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(26,26,26,0.6) 0%, transparent 50%)'}}></div>
            
            <div className={clsx(
            	"absolute left-0 top-0 px-8 md:px-16 lg:px-24",
            	"max-w-2xl h-full flex flex-col justify-center items-start text-left",
            )}>
              {/* Tag */}
              <span className="inline-block px-4 py-1.5 mb-6 text-xs tracking-widest uppercase text-white rounded-full" style={{backgroundColor: '#d4a574'}}>
                {slide.tag || 'New Collection'}
              </span>
              
              {/* Title */}
            	<h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                {slide.title}
              </h2>
              
              {/* Subtitle */}
            	<p className="text-lg md:text-xl mb-8 font-light max-w-md leading-relaxed" style={{color: '#e8d5c4'}}>
                {slide.desc}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <button className="group flex items-center gap-3 px-8 py-4 bg-white font-medium rounded-full hover:opacity-90 transition-all duration-300" style={{color: '#1a1a1a'}}>
                    Shop Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to="/products?category=dresses">
                  <button className="px-8 py-4 border-2 border-white/50 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300">
                    View Dresses
                  </button>
                </Link>
              </div>
            </div>
          </>)}
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-10 w-14 h-14 flex justify-center items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
      >
	    	<ChevronLeft width={24} height={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-10 w-14 h-14 flex justify-center items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
      >
	    	<ChevronRight width={24} height={24} />
      </button>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 items-center">
	  		{slides.map((_, index) => (
	  			<button 
		  			key={index}
		  			onClick={() => setCurrent(index)}
		  			className="h-1 rounded-full cursor-pointer transition-all duration-500"
              style={{
                width: index === current ? '48px' : '24px',
                backgroundColor: index === current ? '#d4a574' : 'rgba(255,255,255,0.4)'
              }}
            />
		  	))}
		  </div>
    </div>
  )
}
