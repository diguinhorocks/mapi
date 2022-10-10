import React, {
  useState, useRef, useCallback, useEffect,
} from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { Vortex } from 'react-loader-spinner';
// eslint-disable-next-line import/no-unresolved
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
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
    const offset = (page > 1) ? `&offset=${page * 100}` : '';
    const { data } = await axios.get(`https://api-marvel.rodrigosantiago.dev/comics?limit=100${offset}`);

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
      setLoading(true);
      loadComics();
      applyAutoScroll();
      setInitialized(true);
    }
    return () => {
      setInitialized(false);
    };
  }, []);

  return (
    <>
      {loading && (
        <>
          <section className="loader">
            <Vortex
              visible
              height="180"
              width="180"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={['red', 'white', 'black', 'red', 'black', 'white']}
            />
          </section>
        </>
      )}
      {!loading && (
        <>
          <header>
            <div className="main-logo">
              <img src={marvel} alt="" />
            </div>
          </header>
          <section className="main">
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 3, 750: 5, 900: 7 }}
            >
              <Masonry columnsCount={7}>
                {comics.filter(onlyWithCoverImages).map(renderComic)}
              </Masonry>
            </ResponsiveMasonry>
          </section>
          <footer ref={infiniteRef}>
            <p>
              <a
                href="https://marvel.com"
                target="_blank"
                rel="noreferrer"
              >
                Data provided by Marvel. © 2021 MARVEL
              </a>
            </p>
          </footer>
        </>
      )}
    </>
  );
};

export default Main;
