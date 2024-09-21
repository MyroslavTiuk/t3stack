type Props = {
  content: string;
  author: string;
  address: string;
};
export default function TestimonialCard({ content, author, address }: Props) {
  return (
    <div className="w-full shrink-0 rounded-bl-lg rounded-br-3xl rounded-tl-3xl rounded-tr-lg border border-[#2D78C8] p-4 text-lg text-black sm:w-1/3">
      <p>{content}</p>
      <p className="mt-4 text-[#2D78C8]">
        <span className="font-bold">{author}</span> {address}
      </p>
    </div>
  );
}
