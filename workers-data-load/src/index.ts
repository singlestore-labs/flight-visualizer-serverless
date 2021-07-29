import loadData from "./handler";

addEventListener("scheduled", (event) => {
    event.waitUntil(loadData());
});
