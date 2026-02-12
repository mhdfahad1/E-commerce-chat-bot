import ChatWidget from './components/ChatWidget';

export default function Home() {
  return (
    <main className="store-page">
      {/* Mock e-commerce store landing page */}
      <header className="store-header">
        <div className="store-header-inner">
          <h1 className="store-logo">🛒 ShopAI</h1>
          <nav className="store-nav">
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">Deals</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </header>

      <section className="store-hero">
        <h2>Discover Trending Products</h2>
        <p>Shop the latest in fashion, electronics, and more — powered by AI assistance.</p>
      </section>

      <section className="store-products">
        <h3>Featured Products</h3>
        <div className="product-grid">
          <div className="product-card">
            <div className="product-img">👟</div>
            <h4>Nike Air Max 270</h4>
            <p className="product-price">₹8,995</p>
          </div>
          <div className="product-card">
            <div className="product-img">👕</div>
            <h4>Levi&apos;s Casual Shirt</h4>
            <p className="product-price">₹1,799</p>
          </div>
          <div className="product-card">
            <div className="product-img">🎒</div>
            <h4>Wildcraft Backpack</h4>
            <p className="product-price">₹1,499</p>
          </div>
          <div className="product-card">
            <div className="product-img">⌚</div>
            <h4>Fastrack Analog Watch</h4>
            <p className="product-price">₹1,495</p>
          </div>
        </div>
      </section>

      {/* Chatbot Widget */}
      <ChatWidget />
    </main>
  );
}
