import Image from "next/image";

type Props = {};

const Loader = (props: Props) => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image alt="logo" fill src="/logo.png" />
      </div>
      <p className="text-muted-foreground text-sm">T0r0!d is thinking...</p>
    </div>
  );
};

export default Loader;
