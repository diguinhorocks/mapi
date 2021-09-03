import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import Masonry from 'react-responsive-masonry';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import marvel from '../marvel.svg';
import './Main.scss';

const axios = require('axios').default;

const Main = () => {
  const [comics, setComics] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState();
  const [loading, setLoading] = useState(false);

  const pageRef = useRef(page);
  pageRef.current = page;

  const applyAutoScroll = () => {
    const height = document.querySelector('.main').clientHeight;
    const duration = height * 0.02;
    document.querySelector('.main').style.animation = `scrollToBottom ${duration}s linear infinite`;
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      loadComics();
    }, (duration - 10) * 1000);
  };

  const loadComics = useCallback(async () => {
    setLoading(true);
    const offset = (page > 1) ? `&offset=${page * 100}` : '';
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
  });

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    loadComics();
  };

  const [infiniteRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    rootMargin: '0px 0px 1400px 0px',
    onLoadMore: handleLoadMore,
  });

  useEffect(() => {
    loadComics();
  }, [loadComics]);

  const onlyWithCoverImages = (comic) => comic.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available';

  const renderComic = (comic, key) => (
    <>
      <img alt={key} src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} style={{ width: '100%', display: 'block' }} />
    </>
  );

  return (
    <>
      <header>
        <div className="main-logo">
          <img width="800" src={marvel} alt="" />
        </div>
      </header>
      <section className="main">
        <Masonry columnsCount={7}>
          {comics.filter(onlyWithCoverImages).map(renderComic)}
        </Masonry>
      </section>
      <footer ref={infiniteRef}>
        <p><a href="http://marvel.com">Data provided by Marvel. © 2021 MARVEL</a></p>
      </footer>
    </>
  );
};

export default Main;
