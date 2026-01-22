import React, { useContext, useState } from 'react'
import clsx from "clsx"
import { Link } from "react-router-dom"
import { Menu, Search, User, LogIn, X, ShoppingCart, Heart } from "react-feather"

import { UserContext, CartContext } from '@/App'
import Button from "@/components/Button"
import Input from "@/components/Input"
import UserDropDown from '@/components/UserDropDown'
import api from "@/api"
import useClickOutside from '@/hooks/useClickOutside'

export default function Navbar() {
	const {user, setUser} = useContext(UserContext)
	const {cart, cartDispatch} = useContext(CartContext)
	const [showMenu, setShowMenu] = useState(false)
	const navbarRef = useClickOutside(() => setShowMenu(false))

	return (
		<nav className={clsx(
			"w-full flex flex-wrap justify-between items-center",
			"sticky top-0 z-40 py-4 px-6",
			"bg-white border-b border-gray-200",
			"backdrop-filter backdrop-blur-xl shadow-sm",
			"md:(py-3 px-8)"
		)} ref={navbarRef}>
			<div className="flex justify-between items-center md:mx-0">
				<Link to="/" className="group">
					<div className="flex flex-col items-center">
						<h3 className="font-display text-3xl font-bold tracking-wider text-gray-900">
							BODYCON
						</h3>
						<span className="text-xs tracking-widest font-light uppercase" style={{color: '#d4a574'}}>
							Luxury Fashion
						</span>
					</div>
				</Link>
			</div>

			<div className="flex items-center ml-2 space-x-5 md:order-2">
				<Link to="/wishlist" className="hidden md:flex items-center text-gray-700 hover:text-gray-900 transition-colors">
					<Heart width={22} height={22} />
				</Link>
				<Link to="/cart" className="relative flex items-center group">
					<ShoppingCart width={22} height={22} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
					{cart.products.length ?
						<div className='absolute flex justify-center items-center w-5 h-5 text-white rounded-full -top-2 -right-2 text-xs font-medium' style={{backgroundColor: '#d4a574'}}>
							{cart.products.length}
						</div>
						: null
					}
				</Link>
				{user && 
					<UserDropDown 
						user={user} 
						onLogout={() => {
							api.logoutUser()
							setUser(null)
							cartDispatch({type: "RESET"})
						}} 
					/>
				}
				<button className="md:hidden flex items-center focus:outline-none text-gray-900">
					{showMenu 
						? <X width={24} height={24} onClick={() => setShowMenu(false)} />
						:	<Menu width={24} height={24} onClick={() => setShowMenu(true)} />
					}
				</button>
			</div>

			<div className={clsx(
				"hidden w-full",
				showMenu && "!flex flex-col mt-8",
				"md:(flex flex-row mt-0 ml-auto order-1 w-auto)"
			)}>
				<ul className={clsx(
					"flex flex-col items-center order-2",
					"mt-8 mb-2 text-lg space-y-1",
					"md:(flex-row text-sm m-0 space-y-0 space-x-1)"
				)} onClick={() => setShowMenu(false)}>
					<NavLink to="/products?category=dresses">Dresses</NavLink>
					<NavLink to="/products?category=tops">Tops</NavLink>
					<NavLink to="/products?category=bottoms">Bottoms</NavLink>
					<NavLink to="/products?category=sets">Co-ord Sets</NavLink>
					<NavLink to="/products">New In</NavLink>
				</ul>
				<div className="flex items-center order-1 md:order-2 md:ml-4">
					<Input 
						className="md:max-w-min bg-opacity-40" 
						icon={<Search />} 
						placeholder="Search..." 
					/>
				</div>
			{!user && (
				<ul className={clsx(
					"flex flex-col order-3",
					showMenu && "mt-4",
					"md:(flex-row text-base mt-0 space-x-2 ml-4)"
				)}>
					<li>
						<Link to="/login">
							<Button secondary className="w-full md:w-auto">
								<LogIn width={18} height={18} className="mr-2" />Login
							</Button>
						</Link>
					</li>
					<li>
						<Link to="/register">
							<Button className="w-full md:w-auto">
								<User width={18} height={18} className="mr-2" />Join Us
							</Button>
						</Link>
					</li>
				</ul>
			)}
			</div>
		</nav>
	)
}

function NavLink({ children, to }) {
	return (
		<li className="relative group">
			<Link 
				to={to}
				className="block px-4 py-2 text-gray-700 font-medium tracking-wide hover:text-gray-900 transition-colors duration-300"
			>
				{children}
			</Link>
		</li>
	)
}