export function reorderWorkouts(workoutsObject) {
  let workoutArray = [];
  Object.keys(workoutsObject).forEach((key) => {
    workoutArray.push({ id: key, data: workoutsObject[key] });
  });

  workoutArray.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  let returnObject = {};
  workoutArray.forEach((item) => {
    returnObject[item.id] = item.data;
  });

  return returnObject;
}
