const SCALE = 4; // each bucket is SCALE times as likely as the next

//const log = console.log;
const log = () => {};

const Util = {

  MAX_SCORE: 4,

  // buckets: i -> [...] words in that bucket
  // choose word randomly such that word in bucket n is SCALE times as likely as bucket n+1
  pickFromBuckets: (buckets) => {
    var sum = 0;
    const weights = buckets.map((list, i)  => {
      const weight = list.length * SCALE ** (buckets.length - i - 1);
      sum += weight;
      return weight;
    });
    var r = Math.random();
    log('r:', r);
    const index = weights.reduce((result, weight, index) => {
      log('result=', result, ' weight=', weight, ' index=', index);
      if (result === undefined) {
        const p = weight / sum;
        r -= p;
        log('p=', p, ' r now=', r);
        if (r < 0) {
          result = index;
        }
      }
      return result;
    }, undefined);
    const bucket = buckets[index];
    const i = Math.floor(Math.random() * bucket.length);
    log(`i=${i} word=${bucket[i]}`);
    return bucket[i];
  },

  moveBucket: (buckets, value, from, to) => {
    if (to >= buckets.length) console.error(`*** to is too big`);
    var result = [...buckets];
    const fi = result[from].indexOf(value);
    if (fi < 0) {
      console.error(`ERROR: moveBucket: ${value} is not in bucket ${from}: ${result[from]}`);
      return;
    }
    result[from].splice(fi, 1);
    result[to].push(value);
    return result;
  },

  fetchWords: (success, error) => {
    if (isDevelopment()) {
      setTimeout(() => success(getTestData()), 2000);
    } else {
      fetch('/flashcards/words')
        .then(res => res.json())
        .then(data => success(data))
        .catch(err => error(err.message));
    }
  },

  // Apply func to each key-value pair and return array of results.
  // func maps (key, value) => newElement
  mapObjectToArray: (object, func) => (
    Object.entries(object).map(([key, value]) => (func(key, value)))
  ),

  // Apply func to each key-value pair and create a new object
  // func maps (key, value) => [newKey, newValue]
  mapObject: (object, func) => (
    Object.fromEntries(Util.mapObjectToArray(object, func))
  ),

  // Apply func to each key-value pair and create a new object
  // func maps (key, value) => newValue
  mapObjectValues: (object, func) => (
    Util.mapObject(object, (key, value) => [key, func(key, value)])
  ),

  // Apply func to each key-value pair and return a new objects containing entries that are true.
  // func: (key, value) => should entry be included?
  filterObject: (object, func) => (
    Object.fromEntries(Object.entries(object).filter(([key, value]) => func(key, value)))
  ),

  // Numbers from start to less than stop by step
  range: (start, stop, step) => {
    if (!step) step = 1;
    return Array.from(
      { length: (stop - start + step - 1) / step },
      (value, index) => start + index * step
    );
  },

};

const isDevelopment = () => (process.env['NODE_ENV'] === 'development');

const getTestData = () => {
  return {
    'Verbs': {
      'Avere': [
        'i have', 'io ho', 'you have', 'to hai', 'he/she has', 'lui/lei ha',
        'we have', 'noi abbiamo', 'you all have', 'voi avete', 'they have', 'loro hono'],
      'Essere': [
        'i am', 'io nono', 'you are', 'tu sai', 'he/she is', 'lui/lei e',
        'we are', 'noi siamo', 'you all are', 'voi siete', 'they are', 'loro sono'],
      'Tenere': [
        'i hold', 'io tengo', 'you hold', 'tu tieni', 'he/she holds', 'lue/lei tiene',
        'we hold', 'noi teniamo', 'you all hold', 'voi tenete', 'they hold', 'loro tengono'],
    },
    'Misc': {
      'Days of the week': [
        'Monday', 'lunedì', 'Tuesday', 'martedì', 'Wednesday', 'marcoledì',
        'Thursday', 'giovedì', 'Friday', 'venerdì', 'Saturday', 'sabato', 'Sunday', 'domenica'],
      'Months': [
        'January', 'gennaio', 'February', 'febbraio', 'March', 'marzo',
        'April', 'aprile', 'May', 'maggio', 'June', 'giugno',
        'July', 'luglio', 'August', 'agosto', 'September', 'settembre',
        'October', 'ottobre', 'November', 'novembre', 'December', 'dicembre'],
    },
  };
};

export default Util;
