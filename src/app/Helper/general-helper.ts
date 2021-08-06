export function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

export function parseDate(dateStr) {
  if (isNaN(dateStr)) { //Checked for numeric
    var dt = new Date(dateStr);
    if (isNaN(dt.getTime())) { //Checked for date
      return dateStr; //Return string if not date.
    } else {
      return dt; //Return date **Can do further operations here.
    }
  } else {
    return dateStr; //Return string as it is number
  }
}

export function groupBy(xs, f) {
  return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}

export var basicTrace = {
  type: '',
  name: '',
  mode: '',
  showlegend: false,
  x: [],
  y: [],
  fill: '',
  stackgroup: null,
  values: [],
  labels: [],
  marker: {
    color: ''
  },
  textinfo: '',
  automargin: false,
  text: {
    cliponaxis: false
  }
};