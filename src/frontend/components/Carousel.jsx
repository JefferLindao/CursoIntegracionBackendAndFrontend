import React from 'react';
import '../assets/style/components/Carousel.scss';

const Carousel = ({ children }) => (
  <section className="carousel">
    <div className="carousel__container">
      {children}
    </div>
  </section>

);

export default Carousel;
