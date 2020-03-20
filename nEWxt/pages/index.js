import getEasywebData from "../easyweb-api";

function Index({ data }) {
  return (
    <div>
      <p>
        Hello nEWxt.
        <br /> Layout-id: {data.id},<br /> Layout-label: {data.label}
      </p>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  var data = await getEasywebData("/load/layout");
  // Pass data to the page via props
  return { props: { data } };
}

export default Index;
