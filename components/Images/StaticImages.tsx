import Image from "next/image";
import pubImage1 from "@/public/front_pic_0.jpg";
import pubImage2 from "@/public/front_pic_1.jpg";
import pubImage3 from "@/public/front_pic_2.jpg";
import pubImage4 from "@/public/front_pic_3.jpg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const SquareImage = ({
  source,
  customKey,
}: {
  source: string | StaticImport;
  customKey: string;
}) => (
  <Image
    src={source}
    alt={`public_image_${customKey}`}
    key={`image-${customKey}`}
    className="fill aspect-square rounded-xl border border-[#E8DDC9] bg-white/60 "
    placeholder="blur"
  />
);

const LincolnCredit = () => (
  <p className="text-xs text-white/90 mt-1">
    {"Courtesy of "}
    <a className="text-blue-400 cursor-pointer" href="https://ericlincoln.com/">
      Eric Lincoln
    </a>
  </p>
);

export const StaticImages = () => (
  <>
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
      <SquareImage source={pubImage1} customKey="1" />
      <SquareImage source={pubImage2} customKey="2" />
      <SquareImage source={pubImage3} customKey="3" />
      <SquareImage source={pubImage4} customKey="4" />
    </div>
    <LincolnCredit />
  </>
);

export const LoadingStaticImages = () => (
  <>
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="fill aspect-square rounded-xl border border-[#E8DDC9] bg-white/60"
        />
      ))}
    </div>
    <LincolnCredit />
  </>
);
