import getEasywebData from "../easyweb-api";

const Page = ({ data }) => {
  console.log(data);
  return (
    <div>
      <p>Page urlname: {data.urlname}</p>
      <p>Id: {data.id}</p>
      <p>{data.viewTemplate.label}</p>
    </div>
  );
};

// This gets called on every request
export async function getServerSideProps(ctx) {
  // Simple example to illustrate token call
  //
  var data = await getEasywebData("/load/layout");
  return { props: { data } };
}

export default Page;
