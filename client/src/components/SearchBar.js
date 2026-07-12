import React, { useRef } from 'react';
import { Search, Zap, Camera, Link as LinkIcon, Loader } from 'lucide-react';

const SearchBar = ({ query, setQuery, onSearch, analyzing, handleImageUpload, loading }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="search-section">
      <div className="search-bar-container">
        {query.includes('http') ? <LinkIcon className="search-icon" size={20} color="#2563EB"/> : <Search className="search-icon" size={20}/>}
        
        <input 
          type="text" 
          placeholder={analyzing ? "AI is looking..." : "Search product or paste a link..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch(query)}
        />
        
        <input type="file" ref={fileInputRef} style={{display: 'none'}} accept="image/*" onChange={handleImageUpload} />
        {analyzing ? <Zap className="spin camera-icon" color="#FF6B00" /> : <Camera className="camera-icon" size={20} onClick={() => fileInputRef.current.click()} />}
        
        <button onClick={() => onSearch(query)} className="search-btn">
          {loading ? <Loader className="spin" size={18}/> : "Search"}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
