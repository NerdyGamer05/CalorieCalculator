const getInfo = () => {
  const age = document.getElementById('age');
  const gender = () => {
    const buttons = document.getElementsByName('gender');
    for (const button of buttons) {
      if (button.checked) return button.value;
    }
    return null;
  }
  const height = [document.getElementById('feet'), document.getElementById('inches')];
  const weight = document.getElementById('weight');
  const activity = document.getElementById('activity');

  const data = {
    age: age.value.replace(/[^0-9.]/g, ''),
    gender: gender(),
    height: {
      feet: height[0].value.replace(/[^0-9.]/g, ''),
      inches: height[1].value.replace(/[^0-9.]/g, ''),
    },
    weight: weight.value.replace(/[^0-9.]/g, ''),
    activity: +activity[activity.selectedIndex].value,
  }
  console.log(data);
  if ([NaN, ''].some(element => [data.age, data.height.feet, data.height.inches, data.weight].includes(element)) || data.gender === null) return 'err';
  // Convert values to metric
  data.height = 2.54 * (12 * +data.height.feet + +data.height.inches);
  data.weight = +data.weight / 2.205;
  [data.age, data.activity] = [+data.age, +data.activity];

  let result = [];

  // Return format: [Mifflin-St Jeor Equation, Revised Harris-Benedict Equation]
  if (data.gender === 'male') {
    result = [(10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5, (13.397 * data.weight) + (4.799 * data.height) - (5.677 * data.age) + 88.362];
  } else {
    result = [(10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161, (9.247 * data.weight) + (3.098 * data.height) - (4.330 * data.age) + 447.593];
  }
  result = result.map(element => Math.round(element * data.activity));
  return result;
}


document.getElementById('calculate').addEventListener("click", () => {
  const data = getInfo();
  const output = document.getElementById('output');
  if (data === 'err') {
    output.innerHTML = `<p id="error">An error has occurred. Please ensure that all of the fields were completed properly.</p>`;
    return;
  }
  const average = Math.floor(data.reduce((a,b) => a + b, 0) / 2);
  output.innerHTML = `
  <p>Daily Calorie Estimates</p>
  <table border="1">
    <tbody>
      <tr>
        <td class="group">Maintain weight</td>
        <td>${average}</td>
      </tr>
      ${average < 1750 ? '' : `
      <tr>
        <td class="group">Mild weight loss (0.5 lb/week)</td>
        <td>${average-250}</td>
      </tr>
      <tr>
        <td class="group">Weight loss (1 lb/week)</td>
        <td>${average-500}</td>
      </tr>
      <tr>
        <td class="group">Extreme weight loss (2 lb/week)</td>
        <td>${average-1000}</td>
      </tr>`}
    </tbody>
  </table>
  <br><br>`
});