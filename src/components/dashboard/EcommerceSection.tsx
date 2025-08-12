// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ShoppingBag, Plus, Eye, ExternalLink } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore.ts';
// import { useEcommerceStore } from '../../store/useEcommerceStore.ts';
//
// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: string;
//   image_url: string;
//   size: string;
//   in_stock?: boolean | null;
// }
//
// interface CartItem {
//   id: number;
//   product: Product;
//   quantity: number;
// }
// const EcommerceSection: React.FC = () => {
//   const { isAuthenticated } = useAuthStore();
//   const {
//     products,
//     cartItems,
//     selectedProduct,
//     loading,
//     cartLoading,
//     fetchProducts,
//     fetchCart,
//     addToCart,
//     viewProductDetails,
//     checkout,
//   } = useEcommerceStore();
//   const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
//
//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchProducts();
//       fetchCart();
//     }
//   }, [isAuthenticated, fetchProducts, fetchCart]);
//
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 },
//     },
//   };
//
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.6, ease: 'easeOut' },
//     },
//   };
//
//   const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
//
//   return (
//       <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
//         <motion.div
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="flex items-center justify-between mb-6"
//         >
//           <h2 className="text-xl font-bold text-white flex items-center">
//             <ShoppingBag className="w-5 h-5 text-lime-400 mr-2" />
//             BEFA Store
//             {cartItemCount > 0 && (
//                 <motion.span
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     className="ml-2 px-2 py-1 bg-lime-400 text-black text-xs rounded-full font-bold"
//                 >
//                   {cartItemCount}
//                 </motion.span>
//             )}
//           </h2>
//           <div className="flex bg-gray-800 rounded-lg p-1">
//             <button
//                 onClick={() => setActiveTab('products')}
//                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                     activeTab === 'products' ? 'bg-lime-400 text-black' : 'text-gray-400 hover:text-white'
//                 }`}
//             >
//               Products
//             </button>
//             <button
//                 onClick={() => setActiveTab('orders')}
//                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                     activeTab === 'orders' ? 'bg-lime-400 text-black' : 'text-gray-400 hover:text-white'
//                 }`}
//             >
//               My Orders
//             </button>
//           </div>
//         </motion.div>
//
//         {cartItemCount > 0 && activeTab === 'products' && (
//             <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mb-6 p-4 bg-lime-400/10 border border-lime-400/20 rounded-lg"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-lime-400 font-semibold">
//                     {cartItemCount} item{cartItemCount > 1 ? 's' : ''} in cart
//                   </p>
//                   <p className="text-gray-400 text-sm">Ready for WhatsApp checkout</p>
//                 </div>
//                 <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={checkout}
//                     disabled={cartLoading}
//                     className="px-4 py-2 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex items-center space-x-2"
//                 >
//                   <ExternalLink className="w-4 h-4" />
//                   <span>{cartLoading ? 'Processing...' : 'WhatsApp Checkout'}</span>
//                 </motion.button>
//               </div>
//             </motion.div>
//         )}
//
//         <AnimatePresence mode="wait">
//           {activeTab === 'products' ? (
//               <motion.div
//                   key="products"
//                   variants={containerVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="hidden"
//                   className="space-y-4"
//               >
//                 {loading || cartLoading ? (
//                     <div className="space-y-4">
//                       {Array.from({ length: 3 }).map((_, idx) => (
//                           <div key={idx} className="bg-black/30 border border-gray-700 rounded-lg p-4 animate-pulse">
//                             <div className="flex items-center space-x-4">
//                               <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
//                               <div className="flex-1">
//                                 <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
//                                 <div className="h-3 bg-gray-700 rounded w-1/2"></div>
//                               </div>
//                             </div>
//                           </div>
//                       ))}
//                     </div>
//                 ) : products.length === 0 ? (
//                     <motion.div variants={itemVariants} className="text-center py-8">
//                       <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
//                       <p className="text-gray-400 mb-2">No products available</p>
//                     </motion.div>
//                 ) : (
//                     products.map((product: Product) => (
//                         <motion.div
//                             key={product.id}
//                             variants={itemVariants}
//                             whileHover={{ scale: 1.02, x: 5 }}
//                             className="bg-black/30 border border-gray-700 rounded-lg p-4 hover:border-lime-400/30 transition-all"
//                         >
//                           <div className="flex items-center space-x-4">
//                             <motion.div
//                                 whileHover={{ scale: 1.1 }}
//                                 className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0"
//                             >
//                               <img
//                                   src={product.image_url}
//                                   alt={product.name}
//                                   className="w-full h-full object-cover"
//                                   onError={(e) => {
//                                     e.currentTarget.src = 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg';
//                                   }}
//                               />
//                             </motion.div>
//                             <div className="flex-1">
//                               <div className="flex items-start justify-between">
//                                 <div>
//                                   <h3 className="text-white font-semibold">
//                                     {product.name} ({product.size})
//                                   </h3>
//                                   <p className="text-gray-400 text-sm mt-1">{product.description}</p>
//                                 </div>
//                                 <div className="text-right">
//                                   <div className="text-xl font-bold text-lime-400">₦{product.price}</div>
//                                   {product.in_stock === false && (
//                                       <div className="text-xs mt-1 text-red-400">Out of Stock</div>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="flex items-center justify-between mt-4">
//                                 <motion.button
//                                     whileHover={{ scale: product.in_stock !== false && !cartLoading ? 1.1 : 1 }}
//                                     whileTap={{ scale: product.in_stock !== false && !cartLoading ? 0.9 : 1 }}
//                                     onClick={() => addToCart(product.id)}
//                                     disabled={product.in_stock === false || cartLoading}
//                                     className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
//                                         product.in_stock === false || cartLoading
//                                             ? 'bg-gray-600 cursor-not-allowed'
//                                             : 'bg-lime-400 hover:bg-lime-500'
//                                     }`}
//                                 >
//                                   {cartLoading && product.in_stock !== false ? (
//                                       <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
//                                   ) : (
//                                       <Plus className="w-4 h-4 text-black" />
//                                   )}
//                                 </motion.button>
//                                 <motion.button
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                     onClick={() => viewProductDetails(product.id)}
//                                     className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors flex items-center space-x-1"
//                                 >
//                                   <Eye className="w-3 h-3" />
//                                   <span>View</span>
//                                 </motion.button>
//                               </div>
//                             </div>
//                           </div>
//                         </motion.div>
//                     ))
//                 )}
//               </motion.div>
//           ) : (
//               <motion.div
//                   key="orders"
//                   variants={containerVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="hidden"
//                   className="space-y-4"
//               >
//                 {cartLoading ? (
//                     <div className="space-y-4">
//                       {Array.from({ length: 2 }).map((_, idx) => (
//                           <div key={idx} className="bg-black/30 border border-gray-700 rounded-lg p-4 animate-pulse">
//                             <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
//                             <div className="h-3 bg-gray-700 rounded w-1/3"></div>
//                           </div>
//                       ))}
//                     </div>
//                 ) : cartItems.length > 0 ? (
//                     <>
//                       <motion.div
//                           initial={{ opacity: 0, y: -20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="mb-6 p-4 bg-lime-400/10 border border-lime-400/20 rounded-lg"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-lime-400 font-semibold">
//                               {cartItemCount} item{cartItemCount > 1 ? 's' : ''} in cart
//                             </p>
//                             <p className="text-gray-400 text-sm">Ready for WhatsApp checkout</p>
//                           </div>
//                           <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={checkout}
//                               disabled={cartLoading}
//                               className="px-4 py-2 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex items-center space-x-2"
//                           >
//                             <ExternalLink className="w-4 h-4" />
//                             <span>{cartLoading ? 'Processing...' : 'WhatsApp Checkout'}</span>
//                           </motion.button>
//                         </div>
//                       </motion.div>
//                       {cartItems.map((item: CartItem) => (
//                           <motion.div
//                               key={item.id}
//                               variants={itemVariants}
//                               whileHover={{ scale: 1.01, x: 5 }}
//                               className="bg-black/30 border border-gray-700 rounded-lg p-4 hover:border-lime-400/30 transition-all"
//                           >
//                             <div className="flex items-center justify-between mb-3">
//                               <div>
//                                 <h3 className="text-white font-semibold">
//                                   {item.product.name} ({item.product.size})
//                                 </h3>
//                                 <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-lg font-bold text-lime-400">₦{item.product.price}</div>
//                               </div>
//                             </div>
//                           </motion.div>
//                       ))}
//                     </>
//                 ) : (
//                     <motion.div variants={itemVariants} className="text-center py-8">
//                       <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
//                       <p className="text-gray-400">Your cart is empty</p>
//                       <p className="text-gray-500 text-sm">Add items to your cart to checkout</p>
//                     </motion.div>
//                 )}
//               </motion.div>
//           )}
//         </AnimatePresence>
//
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="mt-6 p-4 bg-lime-400/10 border border-lime-400/20 rounded-lg text-center"
//         >
//           <p className="text-lime-400 text-sm">
//             💬 WhatsApp checkout integration active! Orders redirect to +2349014465194
//           </p>
//         </motion.div>
//
//         <AnimatePresence>
//           {selectedProduct && (
//               <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
//                   onClick={() => useEcommerceStore.setState({ selectedProduct: null })}
//               >
//                 <motion.div
//                     initial={{ scale: 0.7, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     exit={{ scale: 0.7, opacity: 0 }}
//                     className="bg-gray-900 border border-lime-400/20 rounded-2xl p-6 w-full max-w-md"
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                   <img
//                       src={selectedProduct.image_url}
//                       alt={selectedProduct.name}
//                       className="w-full h-48 object-cover rounded-lg mb-4"
//                   />
//                   <h3 className="text-xl font-bold text-white mb-2">
//                     {selectedProduct.name} ({selectedProduct.size})
//                   </h3>
//                   <p className="text-gray-400 mb-4">{selectedProduct.description}</p>
//                   <div className="flex items-center justify-between">
//                     <span className="text-2xl font-bold text-lime-400">₦{selectedProduct.price}</span>
//                     <button
//                         onClick={() => useEcommerceStore.setState({ selectedProduct: null })}
//                         className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//   );
// };
//
// export default EcommerceSection;