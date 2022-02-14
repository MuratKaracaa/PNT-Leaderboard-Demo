// Data parsers to be used in the Kendo UI components, which takes an array of objects but the data comes as stringified

export const parseIncomingGridData = (data) => {
  const tempData = [];
  data.forEach((d) => {
    d = JSON.parse(d);
    const [name, country, eRank, uRank, money] = d;
    const rankDiff = uRank < eRank ? 1 : uRank > eRank ? -1 : 0;
    tempData.push({
      uRank,
      name,
      country,
      money,
      rankDiff,
    });
  });
  return tempData;
};

export const parseIncomingUserData = (data) => {
  data = JSON.parse(data);
  const { userName, name, country, money } = data;
  return [
    {
      userName,
      name,
      country,
      money: Math.round(money),
    },
  ];
};
