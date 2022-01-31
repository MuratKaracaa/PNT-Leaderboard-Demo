import "@progress/kendo-theme-default/dist/all.css";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

// Component to be rendered based on auth status and profile data

const Profile = (data) => {
  return (
    <>
      <h1>Profile</h1>
      <Grid style={{ height: 550 }} data={data} total={data.length}>
        <GridColumn
          field="userName"
          title="User Name"
          minResizableWidth={300}
        />
        <GridColumn field="name" title="Name" minResizableWidth={300} />
        <GridColumn field="country" title="Country" minResizableWidth={300} />
        <GridColumn field="money" title="Money" minResizableWidth={300} />
      </Grid>
    </>
  );
};

export default Profile;
