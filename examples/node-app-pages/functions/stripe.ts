import * as path from "path";
import Stripe from "stripe";

// make sure Stripe imports fine
console.log(Stripe);

export const onRequest = () => {
  // make sure path actually works
  return new Response(path.join("path/to", "some-file"));
};
