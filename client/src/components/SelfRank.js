import "@progress/kendo-theme-default/dist/all.css";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { useSelector } from "react-redux";

// Component defined to be rendered based on the auth state and existance of self rank data, containing info on user, 3 players above him, 2 players below him

const SelfRank = (data) => {
  const uName = useSelector((state) => {
    if (state.dataReducer.profileData) {
      return state.dataReducer.profileData[0].name;
    }
  });

  // cell to display the rank change based on data tracked on the backend
  const cellWithBackGround = (props, bool) => {
    let color = "rgba(255, 255, 0, 0.2)";

    const { rankDiff } = props.dataItem;
    if (rankDiff === 1) {
      color = "rgba(0, 255, 0, 0.2)";
    }
    if (rankDiff === -1) {
      color = "rgba(255, 0, 0, 0.2)";
    }

    const field = props.field || "";
    return (
      <td style={{ backgroundColor: color, color: "transparent" }}>
        {bool && props.dataItem[field]}
      </td>
    );
  };

  // cell to indicate the logged in user among others

  const selfIndicator = (props, bool) => {
    let color;

    const { name } = props.dataItem;
    if (name == uName) color = "rgba(213, 184, 255)";

    const field = props.field || "";
    return (
      <td style={{ backgroundColor: color }}>
        {bool && props.dataItem[field]}
      </td>
    );
  };

  return (
    <div className="App">
      <h1>SelfRank</h1>
      <Grid style={{ height: 550 }} data={data} total={data.length}>
        <GridColumn
          field="uRank"
          title="Rank"
          minResizableWidth={300}
          cell={selfIndicator}
        />
        <GridColumn
          field="name"
          title="Name"
          minResizableWidth={300}
          cell={selfIndicator}
        />
        <GridColumn
          field="country"
          title="Country"
          minResizableWidth={300}
          cell={selfIndicator}
        />
        <GridColumn
          field="money"
          title="Money"
          minResizableWidth={300}
          cell={selfIndicator}
        />
        <GridColumn
          field="rankDiff"
          title="Rank Diff"
          minResizableWidth={300}
          cell={cellWithBackGround}
        />
      </Grid>
    </div>
  );
};

export default SelfRank;
