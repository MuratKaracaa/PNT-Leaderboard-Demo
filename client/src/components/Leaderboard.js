import { useState, useEffect } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { helpers, localstorage } from "../utils";

import { useDispatch, useSelector } from "react-redux";
import { dataActions } from "../store/actions";
import socket from "../services/socket";
import { v4 } from "uuid";

// Main Component of the application, which rerenders on auth status change, to send updated token to the server to retrieve additional data, apart from the
// main first 100 player info

export const Leaderboard = ({ authStatus }) => {
  const dispatch = useDispatch();
  const [board, setBoard] = useState([]);
  const [data, setData] = useState({});
  const [skip, setSkip] = useState(0);
  const token = useSelector((state) => state.authReducer.userToken);
  useEffect(() => {
    const uid = uidCheck();
    // After the connection is created, token and uid info is sent to the server to start the stream
    socket.emit("fetch-leaderboard-data", { token, uid });
    socket.on("fetch-leaderboard-data", (incomingData) => {
      const { rankingFirstHundred, rankingBasedOnUser, userProfile } =
        JSON.parse(incomingData);
      const tempBoard = helpers.parseIncomingGridData(rankingFirstHundred);
      //incoming data is kept in a helper state to be parsed based on skip and pageSize input
      setBoard(tempBoard);
      // data kept in the helper state is parsed to be displayed and paseed on the grid component
      setData((prevData) => {
        return createState(
          prevData.hasOwnProperty("skip") ? prevData.skip : 0,
          prevData.hasOwnProperty("pageSize") ? prevData.pageSize : 10,
          tempBoard
        );
      });

      // conditional state settings

      rankingBasedOnUser &&
        dispatch(
          dataActions.getSelfRankData(
            helpers.parseIncomingGridData(rankingBasedOnUser)
          )
        );
      userProfile &&
        dispatch(
          dataActions.getProfileData(helpers.parseIncomingUserData(userProfile))
        );
    });

    return () => {
      // page refreshing event to stop any cron jobs running because of the previos emits on the server
      if (performance.navigation.type == 1) {
        socket.emit("page-refresh");
      }
    };
  }, [authStatus]);

  // each client sends a uuid to the server to get their own cronjob assisgned to them.

  const uidCheck = () => {
    const existingUid = localstorage.getItem("uid");
    if (existingUid) return existingUid;
    const uid = v4();
    localstorage.setItem("uid", uid);
    return uid;
  };

  // The current page data creating function, taken from the Kendo UI documentation, which contains items as an array of object the fields of which need to correspond to the "field"
  // prop on the component, total as the length of the items array, which is used in showing the total amount of data, skip as the referring to the current page
  // and pageSize to determine the amount of data on the current page

  function createState(skip, take, value) {
    return {
      items: value.slice(skip, skip + take),
      total: value.length,
      skip: skip,
      pageSize: take,
    };
  }

  // page data is stored on the skip state, to avoid return to the first page everytime new data comes in, which is every five seconds

  function handlePageChange(e) {
    const { skip: newSkip, take } = e.page;
    setSkip(newSkip);
    setData(createState(newSkip, take, board));
  }

  // cell definition taken from the Kendo UI documentation to create cell to indicate ranking difference

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

  return (
    <div className="App">
      <h1>Leaderboard</h1>
      <Grid
        style={{ height: 550 }}
        pageable={true}
        pageSize={data.pageSize}
        data={data.items}
        total={data.total}
        skip={skip}
        onPageChange={handlePageChange}
      >
        <GridColumn field="uRank" title="Rank" minResizableWidth={300} />
        <GridColumn field="name" title="Name" minResizableWidth={300} />
        <GridColumn field="country" title="Country" minResizableWidth={300} />
        <GridColumn field="money" title="Money" minResizableWidth={300} />
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
