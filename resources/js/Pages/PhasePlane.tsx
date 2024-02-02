export default function () {
  const { data, setData, post, errors, processing } = useForm<{
    equation1: string;
    equation2: string;
    xMin: string;
    xMax: string;
    yMin: string;
    yMax: string;
  }>({
    equation1: "sin(t) - xy",
    equation2: "cos() - xy",
    xMin: "-3",
    xMax: "3",
    yMin: "-3",
    yMax: "3",
  });

  return <div></div>;
}
