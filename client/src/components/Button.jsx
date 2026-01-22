import React from 'react'
import clsx from "clsx"

export default function Button({ className, children, link, secondary, light, gold, ...props}) {
	return (
    <button 
      className={clsx(
        "inline-flex items-center justify-center px-6 py-3 m-1",
        "bg-gray-800 text-white text-sm font-medium tracking-wide",
        "rounded-full shadow-lg",
        "transition-all duration-300 ease-out",
        "hover:(bg-gray-900 shadow-xl)",
        "focus:(ring-4 ring-gray-300)",
        "focus:outline-none",
        (secondary || link) && "!bg-transparent !shadow-none",
        link && "!text-gray-700 hover:!text-gray-900",
        (secondary || light) && "!text-gray-800",
        light && "!bg-white hover:!bg-gray-100",
        props.disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>

	)
}