export const calculateAnalytics = (users) => {
  if (!users.length) {
    return {
      totalUsers: 0,
      averageAge: 0,
      medianAge: 0,
      oldestUser: { name: '', age: 0 },
      youngestUser: { name: '', age: 100 },
      usersByCountry: {},
      genderDistribution: { male: 0, female: 0, other: 0 },
    };
  }

  
  const ages = users.map(user => user.dob.age);
  const totalAge = ages.reduce((sum, age) => sum + age, 0);
  const averageAge = totalAge / users.length;
  
  
  const sortedAges = [...ages].sort((a, b) => a - b);
  const mid = Math.floor(sortedAges.length / 2);
  const medianAge = sortedAges.length % 2 !== 0 
    ? sortedAges[mid] 
    : (sortedAges[mid - 1] + sortedAges[mid]) / 2;

  
  const sortedByAge = [...users].sort((a, b) => b.dob.age - a.dob.age);
  const oldestUser = {
    name: `${sortedByAge[0].name.first} ${sortedByAge[0].name.last}`,
    age: sortedByAge[0].dob.age,
  };
  const youngestUser = {
    name: `${sortedByAge[sortedByAge.length - 1].name.first} ${sortedByAge[sortedByAge.length - 1].name.last}`,
    age: sortedByAge[sortedByAge.length - 1].dob.age,
  };

  
  const usersByCountry = users.reduce((acc, user) => {
    acc[user.location.country] = (acc[user.location.country] || 0) + 1;
    return acc;
  }, {});

  
  const genderCounts = users.reduce((acc, user) => {
    acc[user.gender] = (acc[user.gender] || 0) + 1;
    return acc;
  }, {});

  const genderDistribution = {
    male: ((genderCounts.male || 0) / users.length * 100).toFixed(1),
    female: ((genderCounts.female || 0) / users.length * 100).toFixed(1),
  };

  return {
    totalUsers: users.length,
    averageAge,
    medianAge,
    oldestUser,
    youngestUser,
    usersByCountry: Object.fromEntries(
      Object.entries(usersByCountry).sort((a, b) => b[1] - a[1])
    ),
    genderDistribution,
  };
};


export const calculateAnalyticsInBackground = (users, callback) => {
  if (window.Worker) {
    const worker = new Worker('analytics.worker.js');
    worker.postMessage(users);
    worker.onmessage = (e) => {
      callback(e.data);
      worker.terminate();
    };
  } else {
    
    const result = calculateAnalytics(users);
    callback(result);
  }
};