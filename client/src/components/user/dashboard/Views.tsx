import { useEffect, useState } from "react";
import { handleDownload } from "./utils/handleDownload";
import { createZip } from "./utils/createZip";
import { executeGenerationChain } from "../../global/utils/executeGenerationChain";

import StarFilled from "../../../assets/media/icons/StarFilled";
import Carousel from "./views/Carousel";
import Grid from "./views/Grid";
import Loading from "../../global/Loading";

export default function Views({ ...props }) {
  const {
    user,
    images,
    imageset,
    setImages,
    activeImageset,
    setNotice,
    spinner,
  } = props;
  const [favourites, setFavourites] = useState([]);
  const [loaded, setLoaded] = useState(imageset.length);
  const [disabled, setDisabled] = useState(false);

  const handleClick = async () => {
    setDisabled(true);

    const data = await executeGenerationChain(
      imageset,
      activeImageset,
      setNotice,
      loaded,
      loaded + 10,
      user._id
    );

    setImages({ ...images, [activeImageset]: data.files });
    setLoaded((prevLoaded: number) => prevLoaded + 10);
    setDisabled(false);
  };

  useEffect(() => {
    setLoaded(imageset.length);
  }, [imageset]);

  // TODO create component which displays if the user clicks a header item that has no files yet

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-white xl:text-2xl py-5 max-w-[240px] pl-3">
            {user.name.toUpperCase()}
          </h1>

          {spinner ? <Loading /> : null}
        </div>

        <div className="text-white flex flex-col gap-5 items-start pl-3">
          {user.fileCounts[activeImageset] === imageset.length ? (
            // encourages user to look through all their files first before downloading
            // hugely resource intensive operation if immediately available
            <button
              type="button"
              className="border border-solid border-white text-lg py-1 px-3 xl:hover:border-rd xl:focus:border-rd transition-colors"
              onClick={async () => {
                const url = await createZip(imageset);

                return handleDownload(
                  `data:application/zip;base64,${url}`,
                  `${user.name}-${activeImageset}.zip`
                );
              }}
            >
              DOWNLOAD: ALL
            </button>
          ) : null}

          <button
            type="button"
            className="border border-solid border-white text-lg flex gap-1 items-center py-1 px-3 xl:hover:border-rd xl:focus:border-rd transition-colors"
            onClick={async () => {
              const url = await createZip(favourites);
              return handleDownload(
                `data:application/zip;base64,${url}`,
                `${user.name}-${activeImageset}.zip`
              );
            }}
          >
            DOWNLOAD: <StarFilled className="w-5 h-5" red={true} />
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={handleClick}
            className="text-white border border-solid text-lg py-2 px-3 xl:hover:border-rd xl:focus:border-rd transition-colors"
          >
            LOAD MORE
          </button>

          <p className="text-lg">
            LOADED: {loaded} / {user.fileCounts[activeImageset]}
          </p>
        </div>

        <div className="text-white"></div>
      </div>

      <div className="absolute bottom-[25px] left-[25px] z-10 bg-black">
        <div className="text-white border border-solid border-white py-2 px-3">
          TEST BOX
        </div>
      </div>

      <Carousel
        favourites={favourites}
        setFavourites={setFavourites}
        imageset={imageset}
      />

      <div className="text-rd text-lg text-center py-20">
        <p>SCROLL FOR GRID &#8595;</p>
      </div>

      <Grid
        favourites={favourites}
        setFavourites={setFavourites}
        imageset={imageset}
      />
    </>
  );
}
