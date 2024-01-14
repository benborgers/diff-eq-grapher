import ziggyRoute from "ziggy-js";

declare global {
    var route: typeof ziggyRoute;
    var SESSION_ID: string;
}
