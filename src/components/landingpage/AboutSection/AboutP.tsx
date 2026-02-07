type Props = {
  text: string;
};

const AboutP = ({ text }: Props) => {
  return (
    <p className="h-min-80 h-fit w-full first-letter:text-primary first-letter:font-bold first-letter:text-2xl   p-5 transition-all hover:shadow-lg  ">
      {text}
    </p>
  );
};

export default AboutP;
