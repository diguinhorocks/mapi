import React, {
  useState, useRef, useCallback, useEffect,
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
  const [initialized, setInitialized] = useState(false);

  const pageRef = useRef(page);
  pageRef.current = page;

  // eslint-disable-next-line no-unused-vars
  const applyAutoScroll = () => {
    let counter = 1;
    setInterval(() => {
      counter += 0.1735479;
      window
        .scrollTo(0, (document.body.scrollHeight - (document.body.scrollHeight - (counter))));
    }, 0);
  };

  const loadComics = useCallback(async () => {
    setLoading(true);
    const offset = (page > 1) ? `&offset=${page * 100}` : '';
    const { data } = await axios.get(`http://localhost:5000/comics?limit=100${offset}`);

    if (data.code === 200) {
      const { data: { results: comicList } } = data;
      setLoading(false);
      setHasNextPage(true);
      setComics([...comics, ...comicList]);
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

  const onlyWithCoverImages = (comic) => comic.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available';

  const renderComic = (comic, key) => (
    <>
      <a href={`/comics/${comic.id}`}>
        <img alt={key} key={1 + Math.random()} src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} style={{ width: '100%', display: 'block' }} />
      </a>
    </>
  );

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      loadComics();
      applyAutoScroll();
    }
    return () => {
      setInitialized(false);
    };
  }, []);

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
        <p><a href="https://marvel.com" target="_blank" rel="noreferrer">Data provided by Marvel. © 2021 MARVEL</a></p>
      </footer>
    </>
  );
};

export default Main;
