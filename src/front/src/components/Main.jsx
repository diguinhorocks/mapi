import React, { useState, useEffect, useRef } from 'react';
import Masonry from 'react-responsive-masonry';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import marvel from '../marvel.svg';
import './Main.scss';

const axios = require('axios').default;

const Main = () => {
  let [comics, setComics] = useState([]);
  let [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState();
  const [loading, setLoading] = useState(false);

  const pageRef = useRef(page);
  pageRef.current = page;

  const loadComics = async () => {
    setLoading(true);
    let offset = (page > 1) ? `&offset=${page * 100}` : ''
    const { data } = await axios.get(`http://localhost:3001/comics?limit=100${offset}`);

    if (data.code === 200) {
      const { data: { results: comicList } } = data;
      setLoading(false);
      setHasNextPage(true);
      setComics([...comics, ...comicList]);
      setTimeout(() => {
        applyAutoScroll();
      }, 500);
    }
  }

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
    loadComics();
  }

  const applyAutoScroll = () => {
    const height = document.querySelector('.main').clientHeight;
    let duration = height * .02;
    document.querySelector('.main').style.animation = 'scrollToBottom ' + duration + 's linear infinite';
    setTimeout(() => {
      loadComics();
    }, (duration - 10) * 1000)
  }

  const [infiniteRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    rootMargin: '0px 0px 1400px 0px',
    onLoadMore: handleLoadMore
  });

  useEffect(() => {
    loadComics();
  }, []);

  const onlyWithCoverImages = (comic) => comic.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available';
  
  const renderComic = (comic, key) => (
    <>
      <img alt={key} src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt=""  style={{width: '100%', display: "block"}} />
    </>
  )

  return (
    <>
      <header>
        <div className="main-logo">
          <img width="800" src={marvel} alt="" />
        </div>
      </header>
      <section className="main" >
        <Masonry columnsCount={7}>
          {comics.filter(onlyWithCoverImages).map(renderComic)}
        </Masonry>
      </section>
      <footer ref={infiniteRef}>
        <p><a href="http://marvel.com">Data provided by Marvel. © 2021 MARVEL</a></p>
      </footer>
    </>
  )
};

export default Main;