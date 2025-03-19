import { Suspense } from "react";
import { ImageSkeleton } from "./ImageSkeleton";

export const ImageWithLoader = ({
  loading,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <Suspense fallback={<ImageSkeleton />}>
      <img loading={loading ?? "lazy"} {...rest} />
    </Suspense>
  );
};
