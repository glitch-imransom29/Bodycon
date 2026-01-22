import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { ChevronRight } from "react-feather"
import { categories, sliderItems } from '@/dummydata'

import Button from "@/components/Button"
import Container from "@/components/Container"
import CategoryList from "@/ui/CategoryList"
import ProductList from "@/ui/ProductList"
import Newsletter from "@/ui/Newsletter"
import Slider from "@/ui/Slider"
import api from '../api'
import { CartContext, UserContext } from "@/App"

export default function HomePage() {
	const {user} = useContext(UserContext)
	const {cartDispatch} = useContext(CartContext)
	const [products, setProducts] = useState([])

	useEffect(() => {
		(async () => {
			const resp = await api.fetchProducts("",true)
			console.log(resp)
			if (resp.status !== "error") {
				setProducts(resp)
			}
		})()
	}, [])

  const addToCart = async (product, quantity=1) => {
		if (user) {
			const resp = await api.addProductsToCart([{productID: product._id, quantity}])
			if (resp.status === "ok") {
				cartDispatch({type: "ADD_PRODUCTS", payload: [{...product, quantity}]})
			}
		} else {
			cartDispatch({type: "ADD_PRODUCTS", payload: [{...product, quantity}]})
		}
	}
	
	return (
		<main className="bg-gray-50">
			{/* Hero Slider */}
			<section>
				<Slider slides={sliderItems} />
			</section>

			{/* Categories */}
			<Container heading="Shop by Category">
				<CategoryList categories={categories} />
			</Container>

			{/* Featured Products */}
			<Container heading="New Arrivals">
				<ProductList products={[...products].splice(0,4)} onAddToCart={addToCart} />

				<Link to="/products" className="flex justify-center">
					<Button className="text-lg mt-6" link>
						View More <ChevronRight className="ml-2" />
					</Button>
				</Link>
			</Container>

			{/* Newsletter */}
			<section className="my-20">
				<Newsletter />
			</section>
		</main>
	)
}