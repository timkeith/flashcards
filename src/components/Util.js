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

};

export default Util;
