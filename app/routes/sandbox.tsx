const generateClouds = async () => {
  const generatedClouds: any = []; //TODO: type
  const numClouds = getRandomNumber(10, 20);
  for (let i = 0; i < numClouds; i++) {
    const cloud = {
      id: i,
      width: getRandomNumber(100, 500),
      height: getRandomNumber(150, 275),
      top: getRandomNumber(-550, -250),
      left: getRandomNumber(-500, 2420),
      seed: getRandomNumber(0, 10000),
    };
    generatedClouds.push(cloud);
  }
  setCloudsData(generatedClouds);
};