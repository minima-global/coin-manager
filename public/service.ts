declare const MDS: any

MDS.init(({ event }) => {
  if (event === "inited") {
    MDS.log("Service initialized")
  }
})
