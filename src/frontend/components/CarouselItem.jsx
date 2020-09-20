/* eslint-disable import/order */
import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { setFavorite, deleteFavorite } from '../actions';
import '../assets/style/components/CarouselItem.scss';
import imgPlay from '../assets/static/play-icon.png';
import imgPlus from '../assets/static/plus-icon.png';
import imgDelete from '../assets/static/remove-icon.png';
import { Link } from 'react-router-dom';

const CarouselItem = (props) => {
  const { id, cover, title, year, contentRating, duration, isList } = props;
  const handleSetFavorite = () => {
    props.setFavorite({
      id, cover, title, year, contentRating, duration
    });
  };
  const handleDeleteFavorite = (itemId) => {
    props.deleteFavorite(itemId);
  };
  return (
    <div className="carousel-item">
      <img className="carousel-item__img" src={cover} alt={title} />
      <div className="carousel-item__details">
        <div>
          <Link to={`/player/${id}`}>
            <img
              className="carousel-item__details--img"
              src={imgPlay}
              alt="Play Icon"
            />
          </Link>
          { isList ? (
            <img
              className="carousel-item__details--img"
              src={imgDelete}
              alt="Delete Icon"
              onClick={() => handleDeleteFavorite(id)}
            />
          ) : (
            <img
              className="carousel-item__details--img"
              src={imgPlus}
              alt="Plus Icon"
              onClick={handleSetFavorite}
            />
          )}
        </div>
        <p className="carousel-item__details--title">{title}</p>
        <p className="carousel-item__details--subtitle">
          {`${year} ${contentRating} ${duration}`}
        </p>
      </div>
    </div>
  );
};

CarouselItem.propType = {
  cover: PropType.string,
  title: PropType.string,
  year: PropType.number,
  contentRating: PropType.string,
  duration: PropType.number
};
const mapDispatchToProps = {
  setFavorite,
  deleteFavorite
};
export default connect(null, mapDispatchToProps)(CarouselItem);
