import { error, json } from "@sveltejs/kit";

export const POST = async ({}) => {
  const link =
    "https://raw.githubusercontent.com/Mnichus3142/Time-Rush/refs/heads/main/docs/CHANGELOG.md";
  const response = await fetch(link);
  const data = await response.text();
  const lines = data.split("\n");
  let returnData = "";
  let counter = 0;

  lines.forEach(function handle(item) {
    if (item[0] === "#") {
      counter += 1;
    }

    if (counter < 2) {
      returnData = returnData + item + "\n";
    }
  });

  return json({ data: returnData, status: 200 });
};
