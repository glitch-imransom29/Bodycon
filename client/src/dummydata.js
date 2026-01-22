export const sliderItems = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Effortless Elegance",
    desc: "Discover our new collection of bodycon dresses designed for the modern woman. Confidence starts here.",
    tag: "New Collection",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Party Season",
    desc: "Turn heads with our stunning evening wear. Bold designs meet luxurious comfort.",
    tag: "Trending Now",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Summer Vibes",
    desc: "Light, breezy, and absolutely gorgeous. Get ready for the sun in style.",
    tag: "Summer 2026",
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Flat 40% Off",
    desc: "Limited time offer on selected styles. Don't miss out on your favorites.",
    tag: "Sale",
  },  
]

export const categories = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "BODYCON DRESSES",
    link: "/products?category=dresses"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1021294/pexels-photo-1021294.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "CROP TOPS",
    link: "/products?category=tops"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "CO-ORD SETS",
    link: "/products?category=sets"
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "PARTY WEAR",
    link: "/products?category=party"
  },
]

export const popularProducts = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Ribbed Bodycon Mini Dress",
    price: 1499,
    category: "dresses"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Off-Shoulder Evening Gown",
    price: 2999,
    category: "dresses"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1021294/pexels-photo-1021294.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Satin Crop Top",
    price: 899,
    category: "tops"
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Floral Co-ord Set",
    price: 1899,
    category: "sets"
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Sequin Party Dress",
    price: 3499,
    category: "party"
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Velvet Midi Dress",
    price: 2199,
    category: "dresses"
  },
  {
    id: 7,
    image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Mesh Sleeve Bodycon",
    price: 1799,
    category: "dresses"
  },
  {
    id: 8,
    image: "https://images.pexels.com/photos/2744193/pexels-photo-2744193.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "High-Waist Pencil Skirt",
    price: 1299,
    category: "bottoms"
  },
]

export const dummyOrderStatus = ['pending', 'shipped', 'in transit', 'delivered']

export const dummyOrders = [0,3,6].map(num => ({
  products: [...popularProducts].splice(num, 3).map(p => ({
    product: p,
    quantity: Math.floor(Math.random() * 3 + 1),
  }))
})).map((order, i) => ({
  ...order,
  id: i,
  amount: order.products.reduce((sum, p) => sum + (p.product.price * p.quantity), 0),
  address: "221b Baker St, London NW1 6XE, UK",
  status: dummyOrderStatus[Math.floor(Math.random() * dummyOrderStatus.length)],
}))