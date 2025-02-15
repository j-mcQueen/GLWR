import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import ActionBar from "./ActionBar";

export default function Image({ ...props }) {
  const { activeImage, activeImageset, userId, imageset, carousel } = props;

  return (
    <div className="relative z-0 pt-20">
      <AnimatePresence mode="wait">
        {activeImage && (
          <motion.div
            key={uuidv4()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img
              loading="lazy"
              src={
                activeImage instanceof File
                  ? URL.createObjectURL(activeImage)
                  : ""
              }
              alt={activeImage?.name}
              className={carousel ? "h-[50dvh]" : "h-[40dvh]"}
            />

            <div className="text-white flex justify-between py-2">
              <ActionBar
                userId={userId}
                activeImage={activeImage}
                activeImageset={activeImageset}
                imageset={imageset}
                carousel={carousel}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
